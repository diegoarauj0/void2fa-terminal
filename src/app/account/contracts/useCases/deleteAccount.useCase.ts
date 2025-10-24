import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface IDeleteAccountUseCase {
  deleteAccount: (id: string) => Promise<HotpAccountEntity | TotpAccountEntity>;
}
