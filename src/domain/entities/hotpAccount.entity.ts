export class HotpAccountEntity {
  public type: string = "HOTP";

  constructor(
    public id: string,
    public secret: string,
    public counter: number,
    public digits: number,
    public algorithm: "sha1" | "sha256" | "sha512",
    public issuer: string,
    public name: string,
    public encoding?: "ascii" | "hex" | "base32" | "base64",
    public code?: string
  ) {}
}
