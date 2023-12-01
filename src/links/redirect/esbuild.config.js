const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./redirect.ts"],
    outfile: "./dist/redirect.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
