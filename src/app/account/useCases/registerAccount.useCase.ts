import type {
  IRegisterAccountDTO,
  IRegisterAccountUseCase,
} from "../contracts/useCases/registerAccount.useCase.js";
import type { IAccountRepository } from "../contracts/repositories/account.repository.js";
import { inject, injectable } from "tsyringe";
import crypto from "node:crypto";

@injectable()
export class RegisterAccountUseCase implements IRegisterAccountUseCase {
  constructor(@inject("IAccountRepository") private accountRepository: IAccountRepository) {}

  public async registerAccount(dto: IRegisterAccountDTO): Promise<void> {
    await this.accountRepository.save({ ...dto.account, id: crypto.randomUUID() });
  }
}
