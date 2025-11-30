import path from "path";

const root = process.cwd();

export const config = {
  totpAccountFile: path.join(root, "data", "toptAccountFile.json"),
  hotpAccountFile: path.join(root, "data", "hotpAccountFile.json"),
  serviceName: "void2fa",
  version: "1.0.0",
  name: "Void2FA",
  bin: "void2fa",
};
