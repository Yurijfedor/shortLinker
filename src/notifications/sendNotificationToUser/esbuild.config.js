const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./sendNotificationToUser.ts"],
    outfile: "./dist/sendNotificationToUser.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
