import type { IFindAccountUseCase } from "@app/account/contracts/useCases/findAccount.useCase.js";
import { accountIdSchema } from "validators/account.validators.js";
import { inject, injectable } from "tsyringe";
import Table from "cli-table3";
import chalk from "chalk";
import Joi from "joi";

@injectable()
export class FindAccountController {
  private findAccountByIdSchema = Joi.object({
    id: accountIdSchema.required(),
  });

  constructor(@inject("IFindAccountUseCase") private findAccountUseCase: IFindAccountUseCase) {}

  private createTable(headers: string[]): Table.Table {
    return new Table({
      head: headers.map((h) => chalk.cyan(h)),
      style: {
        head: [],
        border: ["gray"],
      },
    });
  }

  private accountRender(account: any, showSecret = false): void {
    const headers = [
      "ACCOUNT ID",
      "NAME",
      "ISSUER",
      "TYPE",
      "PERIOD",
      "DIGITS",
      "COUNTER",
      "ALGORITHM",
      "ENCODING",
      ...(showSecret ? ["SECRET", "CODE"] : []),
    ];

    const table = this.createTable(headers);

    table.push([
      account.id,
      account.name,
      account.issuer || chalk.dim("none"),
      account.type,
      "period" in account ? account.period : chalk.dim("none"),
      account.digits ?? chalk.dim("none"),
      "counter" in account ? account.counter : chalk.dim("none"),
      account.algorithm,
      account.encoding ?? chalk.dim("none"),
      ...(showSecret ? [account.secret, account.code] : []),
    ]);

    console.log("\n" + table.toString());
  }

  private accountsRender(accounts: Array<any>, showSecret = false): void {
    if (!accounts.length) {
      console.log(chalk.yellow("No account was found."));
      return;
    }

    const headers = [
      "ACCOUNT ID",
      "NAME",
      "ISSUER",
      "TYPE",
      "PERIOD",
      "COUNTER",
      "ALGORITHM",
      "ENCODING",
      ...(showSecret ? ["SECRET", "CODE"] : []),
    ];

    const table = this.createTable(headers);

    for (const account of accounts) {
      table.push([
        account.id,
        account.name,
        account.issuer || chalk.dim("none"),
        account.type,
        "period" in account ? account.period : chalk.dim("none"),
        "counter" in account ? account.counter : chalk.dim("none"),
        account.algorithm,
        account.encoding ?? chalk.dim("none"),
        ...(showSecret ? [account.secret, account.code] : []),
      ]);
    }

    console.log("\n" + table.toString());
  }

  public async findAccountById(_id: string, secret: boolean): Promise<void> {
    try {
      const result = await this.findAccountByIdSchema.validateAsync({ id: _id });

      const account = await this.findAccountUseCase.findAccount(result.id);

      if (account === null) {
        return console.log(chalk.yellow("This account was not found"));
      }

      this.accountRender(account, secret);
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        return console.log(chalk.red(`error: ${err.message}`));
      }

      console.log(chalk.red(`error: ${err}`));
    }
  }

  public async findAllAccounts(secret: boolean): Promise<void> {
    try {
      const accounts = await this.findAccountUseCase.findAllAccounts();

      this.accountsRender(accounts, secret);
    } catch (err) {
      console.log(chalk.red(`error: ${err}`));
    }
  }
}
