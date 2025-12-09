import { validators } from "@/validators/account.validators.js";
import { BaseVO } from "@/domain/VOs/base.vo.js";

export class EncodingVO extends BaseVO<"ascii" | "hex" | "base32" | "base64"> {
  constructor(value: string) {
    super(value as any, validators.encoding, "encoding");
  }
}

export class AlgorithmVO extends BaseVO<"sha1" | "sha256" | "sha512"> {
  constructor(value: string) {
    super(value as any, validators.algorithm, "algorithm");
  }
}

export class CounterVO extends BaseVO<number> {
  constructor(value: number) {
    super(value, validators.counter, "counter");
  }
}

export class PeriodVO extends BaseVO<number> {
  constructor(value: number) {
    super(value, validators.period, "period");
  }
}

export class TypeVO extends BaseVO<"TOTP" | "HOTP"> {
  constructor(value: "TOTP" | "HOTP") {
    super(value as any, validators.type, "type");
  }
}

export class IssuerVO extends BaseVO<string> {
  constructor(value: string) {
    super(value, validators.issuer, "issuer");
  }
}

export class SecretVO extends BaseVO<string> {
  constructor(value: string) {
    super(value, validators.secret, "secret");
  }

  public detectEncoding(): EncodingVO {
    if (this.value.replace(/[0-9A-F]/gi, "").length === 0) return new EncodingVO("hex");
    if (this.value.replace(/[2-7A-Z]/g, "").length === 0) return new EncodingVO("base32");
    if (this.value.replace(/[0-9a-z+/=]/gi, "").length === 0) return new EncodingVO("base64");
    return new EncodingVO("ascii");
  }
}

export class NameVO extends BaseVO<string> {
  constructor(value: string) {
    super(value, validators.name, "name");
  }
}

export class IDVO extends BaseVO<string> {
  constructor(value: string) {
    super(value, validators.ID, "ID");
  }
}

export class DigitsVO extends BaseVO<number> {
  constructor(value: number) {
    super(value, validators.digits, "digits");
  }
}
