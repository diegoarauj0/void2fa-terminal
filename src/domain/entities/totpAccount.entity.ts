import * as VOs from "@/domain/VOs/account.vo.js";

interface CreateData {
  algorithm: string;
  encoding: string;
  period: number;
  secret: string;
  digits: number;
  issuer: string;
  name: string;
  id: string;
}

export class TotpAccountEntity {
  constructor(
    public readonly id: VOs.IDVO,
    public name: VOs.NameVO,
    public issuer: VOs.IssuerVO,
    public secret: VOs.SecretVO,
    public digits: VOs.DigitsVO,
    public algorithm: VOs.AlgorithmVO,
    public encoding: VOs.EncodingVO,
    public period: VOs.PeriodVO,
  ) {}

  public static create(data: CreateData): TotpAccountEntity {
    return new TotpAccountEntity(
      new VOs.IDVO(data.id),
      new VOs.NameVO(data.name),
      new VOs.IssuerVO(data.issuer),
      new VOs.SecretVO(data.secret),
      new VOs.DigitsVO(data.digits),
      new VOs.AlgorithmVO(data.algorithm),
      new VOs.EncodingVO(data.encoding),
      new VOs.PeriodVO(data.period),
    );
  }

  public toJSON() {
    return {
      id: this.id.toValue(),
      name: this.name.toValue(),
      issuer: this.issuer.toValue(),
      secret: this.secret.toValue(),
      digits: this.digits.toValue(),
      algorithm: this.algorithm.toValue(),
      encoding: this.encoding.toValue(),
      period: this.period.toValue(),
    }
  }
}
