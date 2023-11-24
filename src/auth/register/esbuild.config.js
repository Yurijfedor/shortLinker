const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./register.ts"],
    outfile: "./dist/register.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
