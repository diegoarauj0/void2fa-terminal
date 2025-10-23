import type { IRegisterAccountUseCase } from "@app/account/contracts/useCases/registerAccount.useCase.js";
import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

type Account = Omit<TotpAccountEntity, "id"> | Omit<HotpAccountEntity, "id">;

export class RegisterAccountController {
  constructor(private registerAccountUseCase: IRegisterAccountUseCase) {}

  public async registerAccount(account: Account): Promise<void> {
    await this.registerAccountUseCase.registerAccount({ account: account });
  }
}
