import path from "path";

const root = process.cwd();

export const config = {
  accountFile: path.join(root, "data", "accountFile.json"),
  serviceName: "void2fa",
  version: "1.1.1",
  name: "Void2FA",
  bin: "void2fa",
};
