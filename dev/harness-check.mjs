import { spawn } from "node:child_process";
import { createReadStream, existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runNativeDensityChecks } from "./calendar-density-native-check.mjs";

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
  ...[[1920,1080],[390,844],[320,568]].map(([width,height])=>({
    name:"wall",checks:"zoom-preferences",chromeHeight:64,width,height,
    expectedGeometryMarker:"calendar zoom preferences:",
  })),
  {name:"wall",checks:"zoom-preferences",chromeHeight:64,width:1920,panelWidth:400,
    expectedGeometryMarker:"calendar zoom preferences:"},
  {name:"wall",checks:"zoom-preferences",chromeHeight:64,width:390,height:844,reducedMotion:true,
    expectedGeometryMarker:"calendar zoom preferences:"},
  ...[[1920,1080], [812,844], [390,844], [320,568], [844,390]].map(([width,height]) => ({
    name: "wall", checks: "timeline-density", chromeHeight: 64, width, height,
    expectedGeometryMarker: "timeline density:",
  })),
  {name: "wall", checks: "timeline-density", chromeHeight: 64, width: 1920, panelWidth: 400,
    expectedGeometryMarker: "timeline density:"},
  {name: "wall", checks: "timeline-density", chromeHeight: 64, width: 390, height: 844,
    reducedMotion: true, expectedGeometryMarker: "timeline density:"},
  ...[[1920,1080], [812,844], [390,844], [320,568], [844,390]].map(([width,height]) => ({
    name: "wall", checks: "density", chromeHeight: 64, width, height,
    expectedGeometryMarker: "calendar density:",
  })),
  {name: "wall", checks: "density", chromeHeight: 64, width: 1920, panelWidth: 400,
    expectedGeometryMarker: "calendar density:"},
  {name: "wall", checks: "density", chromeHeight: 64, width: 390, height: 844,
    reducedMotion: true, expectedGeometryMarker: "calendar density:"},
  ...[1920, 390].map((width) => ({
    name: "wall", checks: "timeline", chromeHeight: 64, width, reducedMotion: true,
    expectedGeometryMarker: "calendar timeline:",
  })),
  ...[[865,1048], [1920,1080], [390,844], [320,568], [844,390]].map(([width,height]) => ({
    name: "wall", checks: "timeline", chromeHeight: 64, width, height,
    expectedGeometryMarker: "calendar timeline:",
  })),
  {name: "wall", checks: "timeline", chromeHeight: 64, width: 1920, panelWidth: 400,
    expectedGeometryMarker: "calendar timeline:"},
  ...[[812,844], [865,1048], [390,844], [320,568], [1920,1080]].map(([width,height]) => ({
    name: "wall", checks: "chrome", chromeHeight: 64, width, height,
    expectedGeometryMarker: "calendar chrome:",
  })),
  ...[[1920,1080], [390,844], [320,568], [844,390]].map(([width,height]) => ({
    name: "wall", checks: "presentation", chromeHeight: 64, width, height,
    expectedGeometryMarker: "calendar presentation:",
  })),
  {name: "wall", checks: "presentation", chromeHeight: 64, width: 1920, panelWidth: 400,
    expectedGeometryMarker: "calendar presentation:"},
  ...[1920, 390].map(width => ({
    name: "wall", checks: "views", chromeHeight: 64, width,
    expectedGeometryMarker: "calendar view context:",
  })),
  ...[[1920, 1080], [390, 844], [320, 568], [844, 390]].map(([width, height]) => ({
    name: "wall", checks: "details", chromeHeight: 64, width, height,
    expectedGeometryMarker: "calendar details:",
  })),
  ...[1920, 390].flatMap((width) =>
    [false, true].map((reducedMotion) => ({
      name: "wall",
      checks: "navigation",
      chromeHeight: 64,
      width,
      reducedMotion,
      expectedGeometryMarker: "calendar date navigation:",
    })),
  ),
  ...[1920, 390].flatMap((width) =>
    [false, true].map((reducedMotion) => ({
      name: "wall",
      checks: "daily",
      chromeHeight: 64,
      width,
      reducedMotion,
      expectedGeometryMarker: "calendar daily use:",
    })),
  ),
  ...[1920, 746, 390].map((width) => ({
    name: "wall",
    checks: "status",
    chromeHeight: 64,
    width,
    expectedGeometryMarker: "calendar status tiles:",
  })),
  {
    name: "legacy",
    checks: "status",
    chromeHeight: 0,
    width: 390,
    expectedGeometryMarker: "calendar status tiles:",
  },
  ...[1920, 746, 390].map((width) => ({
    name: "wall",
    checks: "alignment",
    chromeHeight: 64,
    width,
    expectedGeometryMarker: "calendar alignment:",
  })),
  {
    name: "wall",
    checks: "interactions",
    chromeHeight: 64,
    expectedGeometryMarker: "avatar-geometry: 4x40x40",
  },
  {
    name: "legacy",
    checks: "smoke",
    chromeHeight: 0,
    expectedGeometryMarker: "avatar-geometry: 4x34x34",
  },
  ...[1920, 800, 749, 400, 390, 320].map((width) => ({
    name: "wall",
    checks: "responsive",
    chromeHeight: 64,
    width,
    expectedGeometryMarker: `responsive wall: ${width}px`,
  })),
  {
    name: "wall",
    checks: "responsive",
    chromeHeight: 64,
    panelWidth: 400,
    expectedGeometryMarker: "responsive wall: 400px",
  },
  ...[644, 400].map((width) => ({
    name: "wall",
    checks: "pan",
    chromeHeight: 64,
    width,
    expectedGeometryMarker: `pan: ${width}px`,
  })),
  ...["healthy", "partial", "missing", "error"].map((feed) => ({
    name: "wall",
    checks: "calendar",
    feed,
    chromeHeight: 64,
    expectedGeometryMarker: `calendar health: ${feed}`,
  })),
  {
    name: "wall",
    checks: "lifecycle",
    chromeHeight: 64,
    expectedGeometryMarker: "calendar lifecycle:",
  },
  {
    name: "wall",
    checks: "integrity",
    chromeHeight: 64,
    expectedGeometryMarker: "calendar integrity:",
  },
  ...[1920, 390].map((width) => ({
    name: "wall",
    checks: "recovery",
    chromeHeight: 64,
    width,
    expectedGeometryMarker: "calendar recovery:",
  })),
];

try {
  for (const {
    name,
    checks,
    chromeHeight,
    width = 1920,
    height = 1080,
    panelWidth,
    feed,
    reducedMotion = false,
    expectedGeometryMarker,
  } of scenarios.filter((scenario) =>
    process.env.HARNESS_ONLY ? scenario.checks === process.env.HARNESS_ONLY : true,
  )) {
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
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" },
      ],
    });
    await cdp.send("Emulation.setTimezoneOverride", { timezoneId: "America/Chicago" });
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: checks === "pan",
    });
    if (checks === "pan") {
      await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
    }

    const url = `http://127.0.0.1:${address.port}/dev/harness.html?scenario=${name}&checks=${checks}&chrome=${chromeHeight}${panelWidth ? `&panel=${panelWidth}` : ""}${feed ? `&feed=${feed}` : ""}`;
    await cdp.send("Page.navigate", { url });
    // Background targets update activeElement but suppress real focus transitions.
    if (["density", "timeline-density", "zoom-preferences"].includes(checks)) await cdp.send("Page.bringToFront");

    if (checks === "pan") {
      const evaluate = async (expression) =>
        (
          await cdp.send("Runtime.evaluate", {
            expression,
            returnByValue: true,
          })
        ).result.value;
      const metrics = () =>
        evaluate(`(() => {
          const root = document.querySelector("moran-family-board-card")?.shadowRoot;
          const board = root?.querySelector(".moran-wall-shell .board");
          if (!board) return null;
          const chip = board.querySelector(".allday-row .adchip");
          const rect = board.getBoundingClientRect();
          const chipRect = chip?.getBoundingClientRect();
          return {
            left: board.scrollLeft,
            max: board.scrollWidth - board.clientWidth,
            top: rect.top,
            offCount: board.querySelectorAll(".header-row .phead.off").length,
            dialogCount: root.querySelectorAll(".dialog").length,
            date: root.querySelector('.tabs [aria-selected="true"]')?.getAttribute('aria-label'),
            axisX: board.querySelector('.axis')?.getBoundingClientRect().left,
            heading: (() => {
              const r = root.querySelector('.dayname').getBoundingClientRect();
              return { x: r.right - 8, y: r.top + r.height / 2 };
            })(),
            chipX: chipRect ? chipRect.left + chipRect.width / 2 : null,
            chipY: chipRect ? chipRect.top + chipRect.height / 2 : null,
            visibleNames: [...board.querySelectorAll(".header-row .phead")]
              .filter((header) => {
                const bounds = header.getBoundingClientRect();
                return bounds.right > rect.left && bounds.left < rect.right;
              })
              .map((header) => header.querySelector(".pname")?.textContent),
          };
        })()`);
      let before;
      for (let attempt = 0; attempt < 100; attempt += 1) {
        before = await metrics();
        if (before?.chipX != null && await evaluate('!document.querySelector("moran-family-board-card")._loading')) break;
        await delay(100);
      }
      if (!before?.chipX || before.max < 200) {
        throw new Error(
          `${width}px board did not render an overflowed Day grid with all-day chip.`,
        );
      }
      const startX = width - 60;
      const headerY = before.top + 40;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: startX, y: headerY, id: 1 }],
      });
      for (let step = 1; step <= 8; step += 1) {
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: startX - (250 * step) / 8, y: headerY, id: 1 }],
        });
        await delay(25);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await delay(100);
      const afterTouch = await metrics();
      if (afterTouch.left < 100) {
        throw new Error(`${width}px native touch swipe did not pan the Day board.`);
      }
      if (afterTouch.date !== before.date || Math.abs(afterTouch.axisX) > 1) {
        throw new Error(`${width}px person swipe changed date or moved the fixed time axis.`);
      }
      await evaluate(
        'document.querySelector("moran-family-board-card").shadowRoot.querySelector(".board").scrollLeft = 0',
      );
      const mouseDrag = async (x, y, distance) => {
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mousePressed",
          x,
          y,
          button: "left",
          clickCount: 1,
        });
        for (let step = 1; step <= 8; step += 1) {
          await cdp.send("Input.dispatchMouseEvent", {
            type: "mouseMoved",
            x: x - (distance * step) / 8,
            y,
            button: "left",
            buttons: 1,
          });
          await delay(25);
        }
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mouseReleased",
          x: x - distance,
          y,
          button: "left",
          clickCount: 1,
        });
        await delay(100);
      };
      await mouseDrag(startX, headerY, 250);
      const afterHeaderDrag = await metrics();
      if (afterHeaderDrag.left < 100 || afterHeaderDrag.offCount !== 0) {
        throw new Error(
          `${width}px mouse drag over a person header failed to pan cleanly (scrollLeft=${afterHeaderDrag.left}, off=${afterHeaderDrag.offCount}).`,
        );
      }
      await evaluate(
        `document.querySelector("moran-family-board-card").shadowRoot.querySelector(".board").scrollLeft = ${before.max}`,
      );
      const chipAtEnd = await metrics();
      if (!chipAtEnd.visibleNames.includes("Household")) {
        throw new Error(
          `${width}px maximum Day-board pan did not reveal the fourth person header.`,
        );
      }
      const chipTravel = Math.min(120, width - chipAtEnd.chipX - 20);
      if (chipTravel < 60) {
        throw new Error(`${width}px all-day chip did not enter the visible board at maximum pan.`);
      }
      await mouseDrag(chipAtEnd.chipX, chipAtEnd.chipY, -chipTravel);
      const afterChipDrag = await metrics();
      if (afterChipDrag.left > before.max - 50 || afterChipDrag.dialogCount !== 0) {
        throw new Error(
          `${width}px mouse drag over an all-day chip failed to pan cleanly (scrollLeft=${afterChipDrag.left}/${before.max}, dialogs=${afterChipDrag.dialogCount}).`,
        );
      }
      const mouseClick = async (x, y) => {
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mousePressed",
          x,
          y,
          button: "left",
          clickCount: 1,
        });
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mouseReleased",
          x,
          y,
          button: "left",
          clickCount: 1,
        });
        await delay(50);
      };
      await evaluate(
        'document.querySelector("moran-family-board-card").shadowRoot.querySelector(".board").scrollLeft = 0',
      );
      await evaluate('document.querySelector("moran-family-board-card").shadowRoot.querySelector(".board").scrollTop = 240');
      await delay(80);
      const timeBeforeFilter = await evaluate('document.querySelector("moran-family-board-card").shadowRoot.querySelector(".board").scrollTop');
      await mouseClick(200, headerY);
      const timeAfterFilter = await evaluate('document.querySelector("moran-family-board-card").shadowRoot.querySelector(".board").scrollTop');
      if (Math.abs(timeBeforeFilter - timeAfterFilter) > 2) {
        throw new Error(`${width}px person filter changed vertical scroll: ${timeBeforeFilter} → ${timeAfterFilter}.`);
      }
      if ((await metrics()).offCount !== 1) {
        throw new Error(`${width}px ordinary person-header click stopped working after panning.`);
      }
      await mouseClick(96, headerY);
      if ((await metrics()).offCount !== 0) {
        throw new Error(`${width}px ordinary person-header click did not restore its lane.`);
      }
      // Native pointer events, not direct handler calls: date heading owns paging.
      const dateStart = await metrics();
      const swipeHeading = async (dx, dy = 0, cancel = false) => {
        const { heading } = await metrics();
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchStart', touchPoints: [{ x: heading.x, y: heading.y, id: 1 }],
        });
        for (let step = 1; step <= 8; step++) {
          await cdp.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x: heading.x + dx * step / 8, y: heading.y + dy * step / 8, id: 1 }],
          });
          await delay(20);
        }
        await cdp.send('Input.dispatchTouchEvent', {
          type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [],
        });
        await delay(100);
      };
      await swipeHeading(-95);
      if ((await metrics()).date !== 'Thursday, Feb 19') {
        throw new Error(`${width}px native date swipe did not advance exactly one day.`);
      }
      const tomorrow = await metrics();
      await mouseDrag(tomorrow.heading.x - 95, tomorrow.heading.y, -95);
      if ((await metrics()).date !== dateStart.date) {
        throw new Error(`${width}px mouse date drag did not return to the previous day.`);
      }
      await swipeHeading(-20);
      await swipeHeading(-95, 0, true);
      await swipeHeading(0, 60);
      if ((await metrics()).date !== dateStart.date) {
        throw new Error(`${width}px short/cancelled/vertical gesture changed the date.`);
      }
      await evaluate(
        `document.querySelector("moran-family-board-card").shadowRoot.querySelector(".board").scrollLeft = ${before.max}`,
      );
      const chipForClick = await metrics();
      await mouseClick(chipForClick.chipX, chipForClick.chipY);
      if ((await metrics()).dialogCount !== 1) {
        throw new Error(`${width}px ordinary all-day chip click stopped working after panning.`);
      }
      const result = {
        status: "pass",
        details: `pan: ${width}px touch ${afterTouch.left}px; header drag ${afterHeaderDrag.left}px; all-day drag ${afterChipDrag.left}px`,
      };
      webSocket.close();
      await fetch(`http://127.0.0.1:${devToolsPort}/json/close/${target.id}`);
      if (!result.details.includes(expectedGeometryMarker)) {
        throw new Error(`${name} pan check did not report ${expectedGeometryMarker}`);
      }
      console.log(
        `${name}: ${width}x1080 America/Chicago browser check passed (${result.details})`,
      );
      continue;
    }

    let result;
    for (let attempt = 0; attempt < (checks === "daily" ? 300 : 100); attempt += 1) {
      const evaluation = await cdp.send("Runtime.evaluate", {
        expression:
          'document.querySelector("#harness-check-result") ? ({ status: document.querySelector("#harness-check-result").dataset.harnessCheck, details: document.querySelector("#harness-check-result").textContent }) : null',
        returnByValue: true,
      });
      result = evaluation.result.value;
      if (result) break;
      await delay(100);
    }

    if (!result) throw new Error(`${name} ${width}px browser check timed out.`);
    if (result.status !== "pass") {
      throw new Error(`${name} ${width}px browser check failed: ${result.details}`);
    }
    if (!result.details.includes(expectedGeometryMarker)) {
      throw new Error(
        `${name} browser check did not report expected geometry marker: ${expectedGeometryMarker}`,
      );
    }
    if (checks === "density" || checks === "timeline-density") await runNativeDensityChecks(cdp, delay);
    webSocket.close();
    await fetch(`http://127.0.0.1:${devToolsPort}/json/close/${target.id}`);
    console.log(
      `${name}: ${width}x${height}${panelWidth ? ` in ${panelWidth}px panel` : ""} America/Chicago browser check passed (${result.details})`,
    );
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
