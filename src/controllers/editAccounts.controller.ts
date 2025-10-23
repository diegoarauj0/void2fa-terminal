import type { IEditAccountUseCase } from "@app/account/contracts/useCases/editAccount.useCase.js";
import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

type Account =
  | (Partial<HotpAccountEntity> & { type: "HOTP"; id: string })
  | (Partial<TotpAccountEntity> & { type: "TOTP"; id: string });

export class EditAccountController {
  constructor(private editAccountUseCase: IEditAccountUseCase) {}

  public async registerAccount(account: Account): Promise<void> {
    await this.editAccountUseCase.editAccount({ account: account });
  }
}
