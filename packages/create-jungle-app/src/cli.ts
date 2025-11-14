#!/usr/bin/env node

import { Command } from "commander";
import { createJungleApp } from "./create-app";
import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

const program = new Command();

program
  .name("create-jungle-app")
  .description("Create a new JungleJSX application")
  .version(packageJson.version);

program
  .argument("[project-name]", "Name of the project")
  .action(async (projectName?: string) => {
    try {
      await createJungleApp(projectName);
    } catch (error) {
      console.error("Error creating ReactServe app:", error);
      process.exit(1);
    }
  });

program.parse();
