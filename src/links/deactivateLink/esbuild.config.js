const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./deactivateLink.ts"],
    outfile: "./dist/deactivateLink.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
