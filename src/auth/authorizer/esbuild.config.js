const esbuild = require("esbuild");
const commonOptions = require("../../../esbuild.config");

esbuild
  .build({
    ...commonOptions,
    entryPoints: ["./authorizer.ts"],
    outfile: "./dist/authorizer.js",
    tsconfig: "./tsconfig.json",
  })
  .catch(() => process.exit(1));
