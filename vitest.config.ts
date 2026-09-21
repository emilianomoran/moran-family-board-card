import { defineConfig } from "vitest/config";

// DST fixtures model Chicago local dates. Set this before creating test workers;
// changing TZ inside a worker does not reliably update Node's Date runtime.
process.env.TZ = "America/Chicago";

export default defineConfig({});
