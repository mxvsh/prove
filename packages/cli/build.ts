const pkg = await Bun.file("./package.json").json();

// Externalize every declared dependency except our own @prove.ink/* workspace packages
const allDeps = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
  ...pkg.devDependencies,
});

const external = allDeps
  .filter((name: string) => !name.startsWith("@prove.ink/"))
  .flatMap((name: string) => [name, `${name}/*`]);

const result = await Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./dist",
  naming: "index.js",
  target: "node",
  minify: true,
  external,
});

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log(
  `Build succeeded — ${result.outputs.map((o) => o.path).join(", ")}`
);
