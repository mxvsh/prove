import { readdir, cp, rm, mkdir, copyFile } from "fs/promises";
import { join, resolve } from "path";
import { spawnSync } from "child_process";

const root = resolve(import.meta.dir, "..");
const packagesDir = join(root, "packages");
const distDir = join(root, "dist");

// Read all package.json files from packages/
const packageDirs = await readdir(packagesDir);
const allPackageJsons: Record<string, any>[] = [];

for (const dir of packageDirs) {
  const pkgPath = join(packagesDir, dir, "package.json");
  const file = Bun.file(pkgPath);
  if (await file.exists()) {
    allPackageJsons.push(await file.json());
  }
}

// Collect all local workspace package names
const localPackageNames = new Set(
  allPackageJsons.map((p) => p.name).filter(Boolean)
);

// Collect all external (non-workspace) dependencies across all packages
const mergedDeps: Record<string, string> = {};

for (const pkg of allPackageJsons) {
  for (const [name, version] of Object.entries<string>({
    ...pkg.dependencies,
    ...pkg.peerDependencies,
  })) {
    if (!localPackageNames.has(name)) {
      mergedDeps[name] = version;
    }
  }
}

// Build external list for bun (exclude local workspace packages)
const external = Object.keys(mergedDeps).flatMap((name) => [
  name,
  `${name}/*`,
]);

console.log(`Bundling CLI with ${external.length / 2} external dependencies...`);

const result = await Bun.build({
  entrypoints: [join(packagesDir, "cli", "index.ts")],
  outdir: distDir,
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

console.log(`Build succeeded — ${result.outputs.map((o) => o.path).join(", ")}`);

// Build web app
console.log("Building web app...");
const webResult = spawnSync("bun", ["run", "build"], {
  cwd: join(root, "apps", "web"),
  stdio: "inherit",
  env: process.env,
});
if (webResult.status !== 0) {
  console.error("Web build failed");
  process.exit(1);
}

// Copy apps/web/dist → dist/web and also merge apps/web/public into it
const webDistDir = join(root, "apps", "web", "dist");
const webPublicDir = join(root, "apps", "web", "public");
const webOutDir = join(distDir, "web");
await rm(webOutDir, { recursive: true, force: true });
await mkdir(webOutDir, { recursive: true });
await cp(webDistDir, webOutDir, { recursive: true });
await cp(webPublicDir, webOutDir, { recursive: true });
console.log(`Copied web build → dist/web`);

// Copy root README → dist/README.md
await copyFile(join(root, "README.md"), join(distDir, "README.md"));
console.log(`Copied README.md → dist/README.md`);

// Read CLI package.json as the base for dist/package.json
const cliPkg = await Bun.file(join(packagesDir, "cli", "package.json")).json();

// Allow CI to stamp the released version via VERSION env var (strips leading "v")
const releaseVersion = process.env.VERSION
  ? process.env.VERSION.replace(/^v/, "")
  : cliPkg.version;

// Build dist package.json: CLI metadata + merged external deps + updated paths
const distPkg = {
  name: cliPkg.name,
  version: releaseVersion,
  description: cliPkg.description,
  type: cliPkg.type,
  repository: {
    type: "git",
    url: "https://github.com/mxvsh/prove",
  },
  main: "./index.js",
  bin: cliPkg.bin
    ? Object.fromEntries(
        Object.entries<string>(cliPkg.bin).map(([k, v]) => [
          k,
          v.replace(/^\.\/dist\//, "./"),
        ])
      )
    : undefined,
  files: ["index.js", "web", "README.md"],
  dependencies: mergedDeps,
  engines: cliPkg.engines,
};

// Remove undefined keys
const cleanDistPkg = Object.fromEntries(
  Object.entries(distPkg).filter(([, v]) => v !== undefined)
);

await Bun.write(
  join(distDir, "package.json"),
  JSON.stringify(cleanDistPkg, null, 2) + "\n"
);

console.log(`Wrote dist/package.json with ${Object.keys(mergedDeps).length} dependencies`);
