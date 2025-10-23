import type { IFindAccountUseCase } from "@app/account/contracts/useCases/findAccount.useCase.js";
import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export class FindAccountController {
  constructor(private findAccountUseCase: IFindAccountUseCase) {}

  public async findAllAccounts(): Promise<(HotpAccountEntity | TotpAccountEntity)[]> {
    return await this.findAccountUseCase.findAllAccounts();
  }

  public async findAccount(id: string): Promise<(HotpAccountEntity | TotpAccountEntity) | null> {
    return await this.findAccountUseCase.findAccount(id);
  }
}
