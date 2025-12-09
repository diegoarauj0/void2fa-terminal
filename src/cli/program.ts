import { findAllCommand } from "@/cli/commands/account/findAll.command.js";
import { deleteCommand } from "@/cli/commands/account/delete.command.js";
import { createCommand } from "@/cli/commands/account/create.command.js";
import { codeCommand } from "@/cli/commands/account/code.command.js";
import { editCommand } from "@/cli/commands/account/edit.command.js";
import { findCommand } from "@/cli/commands/account/find.command.js";
import { config } from "@/config.js";
import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk";

const program = new Command();

const description = chalk.magentaBright(
  `${figlet.textSync(config.name, {
    font: "Slant",
    horizontalLayout: "default",
    verticalLayout: "default",
  })}\n${config.version} A CLI tool for managing 2FA authentication accounts.`,
);

program.name(config.name).version(config.version).description(description);

program.addCommand(codeCommand);
program.addCommand(deleteCommand);
program.addCommand(editCommand);
program.addCommand(findCommand);
program.addCommand(findAllCommand);
program.addCommand(createCommand);

program.parse();
