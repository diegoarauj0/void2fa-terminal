import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface IFindAccountUseCase {
  findAccount: (id: string) => Promise<(HotpAccountEntity | TotpAccountEntity) | null>;
  findAllAccounts: () => Promise<(HotpAccountEntity | TotpAccountEntity)[]>;
}
