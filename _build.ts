import {
  build,
  emptyDir,
} from "https://raw.githubusercontent.com/denoland/dnt/0.31.0/mod.ts";
import packageJson from "./package.json" assert { type: "json" };

await emptyDir("npm");

packageJson.version = Deno.args[0];

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: false,
  test: false,
  declaration: true,
  scriptModule: false,
  compilerOptions: {
    target: "Latest",
    sourceMap: true,
    inlineSources: true,
    lib: [
      "esnext",
      "dom",
    ],
  },
  shims: {
    deno: false,
    timers: false,
    crypto: false,
  },
  package: packageJson,
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
