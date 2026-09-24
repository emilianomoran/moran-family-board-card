import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const calendarIds = (process.env.HA_PREVIEW_CALENDARS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const personNames = (process.env.HA_PREVIEW_PEOPLE ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const token = process.env.HA_PREVIEW_TOKEN;
const baseUrl = process.env.HA_PREVIEW_URL;
const port = Number(process.env.HA_PREVIEW_PORT ?? "4174");
const previewHtml = fileURLToPath(new URL("./live-preview.html", import.meta.url));
const bundleJs = fileURLToPath(new URL("../dist/moran-family-board-card.js", import.meta.url));

if (
  !token ||
  !baseUrl ||
  calendarIds.length === 0 ||
  personNames.length === 0 ||
  !calendarIds.every((id) => /^calendar\.[a-z0-9_]+$/.test(id)) ||
  !Number.isInteger(port) ||
  port < 1024 ||
  port > 65535
) {
  throw new Error(
    "Set HA_PREVIEW_URL, HA_PREVIEW_TOKEN, HA_PREVIEW_CALENDARS, and HA_PREVIEW_PEOPLE; use a valid loopback port.",
  );
}

const allowedCalendars = new Set(calendarIds);
const allowedHostnames = new Set([`127.0.0.1:${port}`, `localhost:${port}`]);
const haUrl = new URL(baseUrl);
if (!(["http:", "https:"].includes(haUrl.protocol) && !haUrl.username && !haUrl.password)) {
  throw new Error("HA_PREVIEW_URL must be an HTTP(S) origin without embedded credentials.");
}

function reply(response, status, body, contentType) {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  });
  response.end(body);
}

function validRange(start, end) {
  const from = Date.parse(start ?? "");
  const until = Date.parse(end ?? "");
  return (
    Number.isFinite(from) &&
    Number.isFinite(until) &&
    until > from &&
    until - from <= 43 * 24 * 60 * 60 * 1000
  );
}

const server = createServer(async (request, response) => {
  if (!allowedHostnames.has(request.headers.host ?? "")) {
    reply(response, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }
  if (request.method !== "GET") {
    reply(response, 405, "Read-only preview", "text/plain; charset=utf-8");
    return;
  }

  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  if (url.pathname === "/" || url.pathname === "/dev/live-preview.html") {
    reply(response, 200, await readFile(previewHtml), "text/html; charset=utf-8");
    return;
  }
  if (url.pathname === "/dist/moran-family-board-card.js") {
    reply(response, 200, await readFile(bundleJs), "text/javascript; charset=utf-8");
    return;
  }
  if (url.pathname === "/api/preview-config") {
    reply(
      response,
      200,
      JSON.stringify({ calendars: calendarIds, people: personNames }),
      "application/json; charset=utf-8",
    );
    return;
  }
  const calendarId = url.pathname.match(/^\/api\/calendars\/(calendar\.[a-z0-9_]+)$/)?.[1];
  if (!calendarId || !allowedCalendars.has(calendarId)) {
    reply(response, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  if (!validRange(start, end)) {
    reply(response, 400, "Invalid calendar range", "text/plain; charset=utf-8");
    return;
  }

  try {
    const upstream = new URL(`/api/calendars/${calendarId}`, haUrl);
    upstream.searchParams.set("start", start);
    upstream.searchParams.set("end", end);
    const result = await fetch(upstream, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!result.ok) throw new Error("Calendar upstream failed");
    const events = await result.json();
    if (!Array.isArray(events)) throw new Error("Calendar upstream was not an event list");
    reply(response, 200, JSON.stringify(events), "application/json; charset=utf-8");
  } catch {
    // Do not send the token or upstream error body into the browser or terminal.
    reply(response, 502, "Calendar source unavailable", "text/plain; charset=utf-8");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Read-only live preview: http://127.0.0.1:${port}/\n`);
});
