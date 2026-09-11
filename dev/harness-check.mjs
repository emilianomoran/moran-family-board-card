import { spawn } from "node:child_process";
import { createReadStream, existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chrome) {
  throw new Error("Chrome was not found. Set CHROME_BIN to run the browser harness checks.");
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
};
const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
  const pathname = decodeURIComponent(
    requestUrl.pathname === "/" ? "/dev/harness.html" : requestUrl.pathname,
  );
  const filePath = resolve(repositoryRoot, `.${pathname}`);
  if (filePath !== repositoryRoot && !filePath.startsWith(`${repositoryRoot}${sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    if (!statSync(filePath).isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolveListen, rejectListen) => {
  server.once("error", rejectListen);
  server.listen(0, "127.0.0.1", resolveListen);
});

const address = server.address();
if (!address || typeof address === "string") throw new Error("Loopback server did not bind.");

const profileRoot = mkdtempSync(resolve(tmpdir(), "moran-family-board-harness-"));
const chromeProcess = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--force-device-scale-factor=1",
    "--window-size=1920,1080",
    "--remote-debugging-port=0",
    `--user-data-dir=${profileRoot}`,
    "about:blank",
  ],
  { env: { ...process.env, TZ: "America/Chicago" }, stdio: "ignore" },
);

const devToolsPortFile = resolve(profileRoot, "DevToolsActivePort");
let devToolsPort;
for (let attempt = 0; attempt < 100; attempt += 1) {
  if (existsSync(devToolsPortFile)) {
    [devToolsPort] = readFileSync(devToolsPortFile, "utf8").trim().split("\n");
    break;
  }
  await delay(100);
}
if (!devToolsPort) throw new Error("Chrome did not expose its DevTools port.");

class CdpClient {
  constructor(webSocket) {
    this.webSocket = webSocket;
    this.nextId = 1;
    this.pending = new Map();
    webSocket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolveCommand, rejectCommand) => {
      this.pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
      this.webSocket.send(JSON.stringify({ id, method, params }));
    });
  }
}

const scenarios = [
  { name: "wall", checks: "interactions", chromeHeight: 64 },
  { name: "legacy", checks: "smoke", chromeHeight: 0 },
];

try {
  for (const { name, checks, chromeHeight } of scenarios) {
    const targetResponse = await fetch(`http://127.0.0.1:${devToolsPort}/json/new?about:blank`, {
      method: "PUT",
    });
    if (!targetResponse.ok) {
      throw new Error(`Could not create Chrome target: ${targetResponse.status}`);
    }
    const target = await targetResponse.json();
    const webSocket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolveOpen, rejectOpen) => {
      webSocket.addEventListener("open", resolveOpen, { once: true });
      webSocket.addEventListener("error", rejectOpen, { once: true });
    });

    const cdp = new CdpClient(webSocket);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setTimezoneOverride", { timezoneId: "America/Chicago" });
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const url = `http://127.0.0.1:${address.port}/dev/harness.html?scenario=${name}&checks=${checks}&chrome=${chromeHeight}`;
    await cdp.send("Page.navigate", { url });

    let result;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const evaluation = await cdp.send("Runtime.evaluate", {
        expression:
          'document.querySelector("#harness-check-result") ? ({ status: document.querySelector("#harness-check-result").dataset.harnessCheck, details: document.querySelector("#harness-check-result").textContent }) : null',
        returnByValue: true,
      });
      result = evaluation.result.value;
      if (result) break;
      await delay(100);
    }

    webSocket.close();
    await fetch(`http://127.0.0.1:${devToolsPort}/json/close/${target.id}`);
    if (!result) throw new Error(`${name} browser check timed out.`);
    if (result.status !== "pass") {
      throw new Error(`${name} browser check failed: ${result.details}`);
    }
    console.log(`${name}: 1920x1080 America/Chicago browser check passed (${result.details})`);
  }
} finally {
  server.close();
  chromeProcess.kill();
  await new Promise((resolveExit) => {
    if (chromeProcess.exitCode !== null) resolveExit();
    else chromeProcess.once("exit", resolveExit);
  });
  rmSync(profileRoot, { recursive: true, force: true });
}
