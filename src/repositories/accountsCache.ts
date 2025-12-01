import type { HotpAccountEntity } from "@/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@/entities/totpAccount.entity.js";

export let accountsCache: Map<string, TotpAccountEntity | HotpAccountEntity> | null = null;
export const resetAccountsCache = (v: Map<string, TotpAccountEntity | HotpAccountEntity> | null) => {
  accountsCache = v;
};
