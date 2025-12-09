import { backgroundColorComponent } from "@/tui/components/backgroundColor.component.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { accountRepository } from "@/repositories/account.repository.js";
import { selectComponent } from "@/tui/components/select.component.js";
import { inputComponent } from "@/tui/components/input.component.js";
import { schemas } from "@/validators/account.validators.js";
import { mainScreen } from "@/tui/core/screen.js";
import blessed from "blessed";

export async function createPage(container: blessed.Widgets.Node) {
  backgroundColorComponent({ backgroundColor: "black", parent: container });

  const accountName = await inputComponent<string>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Name:",
    title: "Account Name",
    schema: schemas.name.required(),
  });

  accountName.containerBox.destroy();

  const issuer = await inputComponent<string>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Issuer:",
    title: "Issuer",
    schema: schemas.issuer.required(),
  });

  issuer.containerBox.destroy();

  const secret = await inputComponent<string>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Secret:",
    title: "Account Secret",
    schema: schemas.secret.required(),
  });

  secret.containerBox.destroy();

  const digits = await inputComponent<number>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Digits:",
    title: "TOTP Code Digits",
    initialValue: "6",
    schema: schemas.digits.required(),
  });

  digits.containerBox.destroy();

  const algorithm = await selectComponent({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Algorithm:",
    width: 20,
    height: 5,
    items: ["sha1", "sha256", "sha512"],
  });

  algorithm.containerBox.destroy();

  const type = await selectComponent({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Account Type:",
    width: 40,
    height: 4,
    items: ["TOTP (Time-based One-Time Password)", "HOTP (HMAC-based One-Time Password)"],
  });

  type.containerBox.destroy();

  const id = crypto.randomUUID();

  let newAccount;

  if (type.value === "TOTP (Time-based One-Time Password)") {
    const period = await inputComponent<number>({
      parent: container,
      backgroundColor: "black",
      color: "magenta",
      label: "Period:",
      title: "TOTP Refresh Interval (seconds)",
      initialValue: "30",
      schema: schemas.period.required(),
    });

    period.containerBox.destroy();

    newAccount = TotpAccountEntity.create({
      id,
      secret: secret.value,
      period: period.value,
      digits: digits.value,
      algorithm: algorithm.value.toLowerCase() as any,
      issuer: issuer.value,
      name: accountName.value,
      encoding: undefined,
    });
  }

  if (type.value === "HOTP (HMAC-based One-Time Password)") {
    const counter = await inputComponent<number>({
      parent: container,
      backgroundColor: "black",
      color: "magenta",
      label: "Counter:",
      title: "HOTP Counter",
      initialValue: "0",
      schema: schemas.counter.required(),
    });

    counter.containerBox.destroy();

    newAccount = HotpAccountEntity.create({
      id,
      secret: secret.value,
      counter: counter.value,
      digits: digits.value,
      algorithm: algorithm.value.toLowerCase() as any,
      issuer: issuer.value,
      name: accountName.value,
      encoding: undefined,
    });
  }

  if (newAccount) {
    await accountRepository.save(newAccount);
  }

  mainScreen.emit("app:page.change", "accounts");
}
