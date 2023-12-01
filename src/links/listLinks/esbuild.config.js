const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./listLinks.ts"],
    outfile: "./dist/listLinks.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
