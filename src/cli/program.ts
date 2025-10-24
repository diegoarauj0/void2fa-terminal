import { Command } from "commander";
import { container } from "tsyringe";
import figlet from "figlet";
import chalk from "chalk";

import { RegisterAccountController } from "./controllers/registerAccount.controller.js";
import { DeleteAccountController } from "./controllers/deleteAccount.controller.js";
import { FindAccountController } from "./controllers/findAccount.controller.js";
import { EditAccountController } from "./controllers/editAccount.controller.js";
import { CopyCodeAccountController } from "./controllers/copyCodeAccount.controller.js";

const controllers = {
  find: container.resolve(FindAccountController),
  register: container.resolve(RegisterAccountController),
  delete: container.resolve(DeleteAccountController),
  edit: container.resolve(EditAccountController),
  copyCode: container.resolve(CopyCodeAccountController),
};

const formatExample = (cmd: string, comment?: string) =>
  `${chalk.gray("$")} ${chalk.magenta(cmd)}${comment ? " " + chalk.dim(comment) : ""}`;

const section = (title: string) => `${chalk.bold(title)}\n\n${chalk.cyan("Examples:")}`;

function createCommand(
  program: Command,
  name: string,
  description: string,
  examples: string[],
  setup: (cmd: Command) => void,
) {
  const cmd = program.command(name);
  cmd.description(`${section(description)}\n  ${examples.join("\n  ")}\n`);
  setup(cmd);
}

const program = new Command();

program
  .name("void-2fa")
  .description(
    chalk.magentaBright(
      `${figlet.textSync("Void-2fa", {
        font: "Slant",
        horizontalLayout: "default",
        verticalLayout: "default",
      })}\n1.0.0\nA CLI tool for managing 2FA authentication accounts.`,
    ),
  )
  .version("1.0.0");

createCommand(
  program,
  "find-all",
  "List all saved accounts",
  [
    formatExample("void-2fa find-all"),
    formatExample("void-2fa find-all --secret", "// display each account’s secret and code"),
  ],
  (cmd) => {
    cmd.option("-s, --secret", "Display each account’s secret and current code");
    cmd.action(async (options) => controllers.find.findAllAccounts(options.secret));
  },
);

createCommand(
  program,
  "find <id>",
  "Show detailed information about a specific account",
  [
    formatExample("void-2fa find 123"),
    formatExample("void-2fa find --secret 123", "// show the account’s secret and code"),
  ],
  (cmd) => {
    cmd.option("-s, --secret", "Display the account’s secret and current code");
    cmd.action(async (id, options) => controllers.find.findAccountById(id, options.secret));
  },
);

createCommand(
  program,
  "register <name> <issuer> <secret>",
  "Register a new account for authentication",
  [
    formatExample("void-2fa register Github diegoarauj0 MRUWKZ3PMFZGC5LKGAQCAIBA"),
    formatExample(
      "void-2fa register --period 30 --type TOTP Github diegoarauj0 MRUWKZ3PMFZGC5LKGAQCAIBA",
      "// set the type to TOTP and period to 30s",
    ),
  ],
  (cmd) => {
    cmd
      .option("-i, --id <id>", "ID: custom id")
      .option("-a, --algorithm <algorithm>", "Algorithm: sha1 (default), sha256, sha512")
      .option("-e, --encoding <encoding>", "Secret encoding: ascii, hex, base32, base64")
      .option("-p, --period <seconds>", "Time period for TOTP (default: 30)")
      .option("-d, --digits <count>", "Number of digits (default: 6)")
      .option("-c, --counter <value>", "Initial counter (for HOTP, default: 0)")
      .option("-t, --type <type>", "Account type: TOTP (default) or HOTP")
      .action(async (name, issuer, secret, options) => {
        await controllers.register.registerAccount({
          account: { name, issuer, secret, ...options },
        });
      });
  },
);

createCommand(
  program,
  "edit <id>",
  "Edit saved account",
  [
    formatExample(
      "void-2fa edit -i negativo_ddz 323e2825-5b92-4bc9-8d3c-57ba2a2a7774",
      "// change issuer to negativo_ddz",
    ),
  ],
  (cmd) => {
    cmd
      .option("-n, --name <name>", "Name")
      .option("-i, --issuer <issuer>", "Issuer")
      .option("-s, --secret <secret>", "Secret")
      .option("-a, --algorithm <algorithm>", "Algorithm: sha1, sha256, sha512")
      .option("-e, --encoding <encoding>", "Encoding: ascii, hex, base32, base64")
      .option("-p, --period <seconds>", "TOTP period")
      .option("-d, --digits <count>", "Digits")
      .option("-c, --counter <value>", "Initial counter (for HOTP)")
      .action(async (id, options) => {
        await controllers.edit.editAccount({ account: { id, ...options } });
      });
  },
);

createCommand(
  program,
  "delete <id>",
  "Delete a saved account",
  [formatExample("void-2fa delete 323e2825-5b92-4bc9-8d3c-57ba2a2a7774")],
  (cmd) => {
    cmd.action(async (id) => controllers.delete.deleteAccount(id));
  },
);

createCommand(
  program,
  "code <id>",
  "Copy totp code to clipboard",
  [
    formatExample("void-2fa code 323e2825-5b92-4bc9-8d3c-57ba2a2a7774"),
    formatExample("void-2fa code --await 323e2825-5b92-4bc9-8d3c-57ba2a2a7774"),
    formatExample("void-2fa code --auto 323e2825-5b92-4bc9-8d3c-57ba2a2a7774"),
  ],
  (cmd) => {
    cmd.option("-n, --next", "Wait for the code to reset before getting the code");
    cmd.option("-a, --auto", "Increment the counter after generating the code");
    cmd.action(async (id, options) => controllers.copyCode.copyCodeAccount(id, options));
  },
);

program.parse();
