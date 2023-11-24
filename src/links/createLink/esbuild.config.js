const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./createLink.ts"],
    outfile: "./dist/createLink.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
