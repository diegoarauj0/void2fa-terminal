import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface IAccountRepository {
  save: (account: HotpAccountEntity | TotpAccountEntity) => Promise<typeof account>;
  findById: (id: string) => Promise<HotpAccountEntity | TotpAccountEntity | null>;
  findAll: () => Promise<(HotpAccountEntity | TotpAccountEntity)[]>;
  delete: (id: string) => Promise<void>;
}
