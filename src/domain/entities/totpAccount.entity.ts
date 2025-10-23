export class TotpAccountEntity {
  public type: string = "TOTP";
  
  constructor(
    public id: string,
    public secret: string,
    public period: number,
    public digits: number,
    public algorithm: "sha1" | "sha256" | "sha512",
    public encoding?: "ascii" | "hex" | "base32" | "base64",
    public code?: string
  ) {}
}
