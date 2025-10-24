import type { IFindAccountUseCase } from "@app/account/contracts/useCases/findAccount.useCase.js";
import type { IEditAccountUseCase } from "@app/account/contracts/useCases/editAccount.useCase.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";
import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import { accountIdSchema } from "validators/account.validators.js";
import { setTimeout } from "node:timers/promises";
import { inject, injectable } from "tsyringe";
import clipboard from "clipboardy";
import chalk from "chalk";
import Joi from "joi";

@injectable()
export class CopyCodeAccountController {
  private copyCodeAccountSchema = Joi.object({
    id: accountIdSchema.required(),
  });

  constructor(
    @inject("IFindAccountUseCase") private findAccountUseCase: IFindAccountUseCase,
    @inject("IEditAccountUseCase") private editAccountUseCase: IEditAccountUseCase,
  ) {}

  public async copyCodeAccount(_id: string, options: { next: boolean; auto: boolean }): Promise<void> {
    try {
      const result = await this.copyCodeAccountSchema.validateAsync({ id: _id });

      let account = await this.findAccountUseCase.findAccount(result.id);

      if (account === null) {
        return console.log(chalk.yellow("This account was not found"));
      }

      if (account.type === "TOTP") {
        return this.totpCodeAccount(account as TotpAccountEntity, options.next);
      }

      if (account.type === "HOTP") {
        return this.hotpCodeAccount(account as HotpAccountEntity, options.auto);
      }

      throw "type unknown";
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        return console.log(chalk.red(`error: ${err.message}`));
      }
      console.log(chalk.red(`error: ${err}`));
    }
  }

  private async totpCodeAccount(_account: TotpAccountEntity, _next: boolean): Promise<void> {
    let remaining = _account.period - (Math.floor(Date.now() / 1000) % _account.period);

    let account = _account;

    if (_next) {
      console.log(chalk.yellow(`waiting ${remaining} seconds for the next code`));
      await setTimeout((remaining + 1) * 1000, undefined);

      account = (await this.findAccountUseCase.findAccount(_account.id)) as TotpAccountEntity;

      if (account === null || account.type !== "TOTP") {
        return console.log(chalk.yellow("This account was modified while waiting"));
      }
    }

    await clipboard.write(account.code || "");

    remaining = (account as any).period - (Math.floor(Date.now() / 1000) % (account as any).period);

    console.log(chalk.green(`Code copied to clipboard. ${remaining} seconds until the next code`));
  }

  private async hotpCodeAccount(_account: HotpAccountEntity, _auto: boolean): Promise<void> {
    let account = _account;

    if (_auto) {
      this.editAccountUseCase.editAccount({
        account: { id: account.id, counter: (account as any).counter + 1 },
      });
      console.log(chalk.yellow(`Counter updated to: ${(account as any).counter + 1}`));
    }

    await clipboard.write(account.code || "");

    console.log(chalk.green("Code copied to clipboard"));
  }
}
