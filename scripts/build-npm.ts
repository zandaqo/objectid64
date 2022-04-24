import {
  build,
  emptyDir,
} from "https://raw.githubusercontent.com/denoland/dnt/0.23.0/mod.ts";

await emptyDir("npm");

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
  },
  shims: {
    deno: false,
    timers: false,
  },
  package: {
    name: "objectid64",
    version: Deno.args[0],
    main: "mod.js",
    type: "module",
    description:
      "The fastest way to convert MongoDB ObjectIDs into shorter, URL-friendly base64 and vice versa.",
    keywords: [
      "objectid",
      "base64",
      "uri",
      "url",
      "short",
      "shorten",
      "mongodb",
    ],
    author: "Maga D. Zandaqo <denelxan@gmail.com> (http://maga.name)",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/zandaqo/objectid64.git",
    },
    homepage: "https://github.com/zandaqo/objectid64#readme",
    bugs: {
      url: "https://github.com/zandaqo/objectid64/issues",
    },
    engines: {
      node: ">=16.0.0",
    },
  },
});
