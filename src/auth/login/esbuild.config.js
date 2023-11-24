const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./login.ts"],
    outfile: "./dist/login.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
