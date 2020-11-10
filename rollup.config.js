import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";

const bundled = "dist/index";

export default {
  input: "src/index.ts",
  output: [
    {
      file: `${bundled}.js`,
      format: "cjs",
    },
    {
      file: `${bundled}.esm.js`,
      format: "esm",
    },
  ],
  plugins: [
    typescript(),
    getBabelOutputPlugin({
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              ie: "11",
            },
            useBuiltIns: "usage",
            corejs: 3,
          },
        ],
      ],
    }),
  ],
  external: ["axios", "lodash", "tweetnacl"],
};
