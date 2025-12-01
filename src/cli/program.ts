import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk";
import { createCommand } from "./commands/account/create.command.js";
import { config } from "@/config.js";
import { codeCommand } from "./commands/account/code.command.js";
import { deleteCommand } from "./commands/account/delete.command.js";
import { editCommand } from "./commands/account/edit.command.js";
import { findCommand } from "./commands/account/find.command.js";
import { findAllCommand } from "./commands/account/findAll.command.js";

const program = new Command();

const description = chalk.magentaBright(
  `${figlet.textSync(config.name, {
    font: "Slant",
    horizontalLayout: "default",
    verticalLayout: "default",
  })}\n${config.version} A CLI tool for managing 2FA authentication accounts.`,
);

program.name("Void2FA-Auth").version(config.version).description(description);

program.addCommand(codeCommand);
program.addCommand(deleteCommand);
program.addCommand(editCommand);
program.addCommand(findCommand);
program.addCommand(findAllCommand);
program.addCommand(createCommand);

program.parse();
