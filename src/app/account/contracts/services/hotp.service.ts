import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";

export interface IHotpService {
  generate: (hotpAccountEntity: HotpAccountEntity) => string;
}
