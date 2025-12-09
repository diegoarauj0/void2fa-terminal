import type { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { config } from "@/config.js";
import chalk from "chalk";

export const logger = {
  info(msg: string) {
    return chalk.cyan(msg);
  },

  debug(msg: string) {
    return chalk.blue.dim(msg);
  },

  success(msg: string) {
    return chalk.bold.green(msg);
  },

  warning(msg: string) {
    return chalk.yellow(msg);
  },

  error(msg: string) {
    return chalk.red(msg);
  },

  title(msg: string) {
    return chalk.bold.magenta(`\n${msg}\n`);
  },

  divider() {
    return chalk.gray("──────────────────────────────────────────────");
  },

  formatExample(command: string, comment?: string) {
    const bin = chalk.magenta(config.bin);
    const cmd = chalk.green(command);
    const prefix = chalk.gray("$");

    const annotation = comment ? " " + chalk.dim(comment) : "";

    return `${prefix} ${bin} ${cmd}${annotation}`;
  },

  account(account: TotpAccountEntity | HotpAccountEntity, showSecret = false) {
    const lines: string[] = [];

    lines.push(logger.divider());
    lines.push(chalk.bold("|  Account Details"));

    lines.push(`${chalk.white("|    ID:")} ${chalk.magenta(account.id.toValue())}`);
    lines.push(`${chalk.white("|    Name:")} ${chalk.magenta(account.name.toValue())}`);
    lines.push(`${chalk.white("|    Issuer:")} ${chalk.magenta(account.issuer.toValue())}`);

    if (showSecret) {
      lines.push(`${chalk.white("|    Secret:")} ${chalk.yellow(account.secret.toValue())}`);
    }

    lines.push(`${chalk.white("|    Encoding:")} ${chalk.magenta(account.encoding.toValue())}`);
    lines.push(`${chalk.white("|    Algorithm:")} ${chalk.magenta(account.algorithm.toValue())}`);
    lines.push(`${chalk.white("|    Digits:")} ${chalk.magenta(account.digits.toValue())}`);

    if (account instanceof TotpAccountEntity) {
      lines.push(`${chalk.white("|    Type:")} ${chalk.magenta("TOTP")}`);
      lines.push(`${chalk.white("|    Period:")} ${chalk.magenta(account.period.toValue())}`);
    } else {
      lines.push(`${chalk.white("|    Type:")} HOTP`);
      lines.push(`${chalk.white("|    Counter:")} ${chalk.magenta(account.counter.toValue())}`);
    }

    return lines.join("\n");
  },
};
