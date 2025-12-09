import type { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import * as VOs from "@/domain/VOs/account.vo.js";

export interface IAccountRepository {
  findByName(name: VOs.NameVO): Promise<HotpAccountEntity | TotpAccountEntity | null>;
  save(account: HotpAccountEntity | TotpAccountEntity): Promise<typeof account>;
  findById(id: VOs.IDVO): Promise<HotpAccountEntity | TotpAccountEntity | null>;
  delete(account: HotpAccountEntity | TotpAccountEntity): Promise<void>;
}
