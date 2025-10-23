import { type IFindAccountUseCase } from "@app/account/contracts/useCases/findAccount.useCase.js";
import type { IAccountRepository } from "../contracts/repositories/account.repository.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";
import { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { IHotpService } from "../contracts/services/hotp.service.js";
import type { ITotpService } from "../contracts/services/totp.service.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAccountUseCase implements IFindAccountUseCase {
  constructor(
    @inject("IAccountRepository") private accountRepository: IAccountRepository,
    @inject("IHotpService") private hotpService: IHotpService,
    @inject("ITotpService") private totpService: ITotpService,
  ) {}

  public async findAllAccounts(): Promise<(HotpAccountEntity | TotpAccountEntity)[]> {
    const accounts = await this.accountRepository.findAll();

    return accounts;
  }

  public async findAccount(id: string): Promise<(HotpAccountEntity | TotpAccountEntity) | null> {
    const account = await this.accountRepository.findById(id);

    if (account === null) {
      return null;
    }

    if (account.type === "HOTP") {
      account.code = this.hotpService.generate(account as HotpAccountEntity);
    }

    if (account.type === "TOTP") {
      account.code = this.totpService.generate(account as TotpAccountEntity);
    }

    return account;
  }
}
