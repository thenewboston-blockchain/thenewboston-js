import babel from "@rollup/plugin-babel";
import ts from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";

import pkg from "./package.json";

const PLUGINS = [
  ts({
    tsconfigOverride: {
      exclude: ["**/*.test.ts"],
      compilerOptions: {
        // Let babel do it's thing
        target: "esnext",
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
  babel({
    extensions: [".ts", ".js"],
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
    external: ["axios"],
  },
];
