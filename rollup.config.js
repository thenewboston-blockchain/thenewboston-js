import ts from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";

import pkg from "./package.json";

const PLUGINS = [
  ts({
    tsconfigOverride: {
      exclude: ["**/*.test.ts"],
      compilerOptions: {
        target: "es5",
        outDir: "./dist",
        rootDir: "./src",
        module: "esnext",
        moduleResolution: "node",
        noEmit: true,
        allowJs: false,
        declaration: false,
        removeComments: false,
        strict: true,
        forceConsistentCasingInFileNames: true,
      },
      include: ["src"],
    },
  }),
  replace({
    _VERSION: JSON.stringify(pkg.version),
  }),
];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "es",
      },
    ],
    plugins: PLUGINS,
    external: ["axios", "tweetnacl"],
  },
];
