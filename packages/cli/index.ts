#!/usr/bin/env node
import { Command } from "commander";
import pkg from "./package.json" with { type: "json" };
import { readConfig } from "./config.js";
import { runSetup } from "./setup.js";
import { startServer } from "./server.js";

const program = new Command();

program
  .name("prove")
  .description("Validate your startup idea with AI-powered research")
  .version(pkg.version);

// Default command: start the server (or run setup on first launch)
program
  .command("start", { isDefault: true })
  .description("Start the prove server (runs setup on first launch)")
  .action(async () => {
    let config = readConfig();

    if (!config) {
      config = await runSetup();
      console.log();
    }

    try {
      const port = await startServer(config);
      console.log(`prove  →  http://localhost:${port}`);
      console.log("Press Ctrl+C to stop.");
    } catch (err) {
      console.error(
        "Failed to start server:",
        err instanceof Error ? err.message : err
      );
      process.exit(1);
    }
  });

// Reset: delete saved config and re-run setup
program
  .command("reset")
  .description("Reset config and run setup again")
  .action(async () => {
    const { unlinkSync, existsSync } = await import("fs");
    const { getConfigPath } = await import("./config.js");
    const configPath = getConfigPath();
    if (existsSync(configPath)) {
      unlinkSync(configPath);
      console.log("Config cleared.");
    } else {
      console.log("No config found.");
    }
    const config = await runSetup();
    console.log();
    const port = await startServer(config);
    console.log(`prove  →  http://localhost:${port}`);
    console.log("Press Ctrl+C to stop.");
  });

// Whoami: show current config
program
  .command("whoami")
  .description("Show current saved config")
  .action(() => {
    const config = readConfig();
    if (!config) {
      console.log("No config found. Run `prove` to set up.");
      return;
    }
    console.log(`Provider : ${config.provider}`);
    console.log(`Role     : ${config.role}`);
  });

program.parse();
