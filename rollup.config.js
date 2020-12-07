import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";

const input = "src/index.ts";
const bundled = "dist/index";
const output = {
  cjs: `${bundled}.js`,
  esm: `${bundled}.esm.js`,
};

const defaultPlugins = [typescript()];
function generateBabelPluginWithTargets(targets) {
  return getBabelOutputPlugin({
    presets: [
      [
        "@babel/preset-env",
        {
          targets,
          useBuiltIns: "usage",
          corejs: 3,
        },
      ],
    ],
  });
}
const external = ["axios", "tweetnacl"];

export default [
  {
    input,
    output: [
      {
        file: output.cjs,
        format: "cjs",
      },
    ],
    plugins: [
      ...defaultPlugins,
      generateBabelPluginWithTargets({
        ie: "11",
      }),
    ],
    external,
  },
  {
    input,
    output: [
      {
        file: output.esm,
        format: "esm",
      },
    ],
    plugins: [
      ...defaultPlugins,
      generateBabelPluginWithTargets({
        firefox: "54",
        chrome: "51",
        safari: "10",
        opera: "38",
      }),
    ],
    external,
  },
];
