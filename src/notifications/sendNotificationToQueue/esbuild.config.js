const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./sendNotificationToQueue.ts"],
    outfile: "./dist/sendNotificationToQueue.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
