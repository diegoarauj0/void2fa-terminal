import type { IDeleteAccountUseCase } from "@app/account/contracts/useCases/deleteAccount.useCase.js";

export class DeleteAccountController {
  constructor(private deleteAccountUseCase: IDeleteAccountUseCase) {}

  public async deleteAccount(id: string): Promise<void> {
    await this.deleteAccountUseCase.deleteAccount(id);
  }
}
