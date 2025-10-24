import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { IHotpService } from "../contracts/services/hotp.service.js";
import speakeasy from "speakeasy";

export class HotpService implements IHotpService {
  private detectEncoding(secret: string): speakeasy.Encoding {
    if (secret.replace(/[0-9A-F]/gi, "").length === 0) return "hex";
    if (secret.replace(/[2-7A-Z]/g, "").length === 0) return "base32";
    if (secret.replace(/[0-9a-z+/=]/gi, "").length === 0) return "base64";
    return "ascii";
  }

  public generate(hotpAccountEntity: HotpAccountEntity): string {
    return speakeasy.hotp({
      counter: hotpAccountEntity.counter,
      secret: hotpAccountEntity.secret,
      algorithm: hotpAccountEntity.algorithm,
      digits: hotpAccountEntity.digits,
      encoding: this.detectEncoding(hotpAccountEntity.encoding || ""),
    });
  }
}
