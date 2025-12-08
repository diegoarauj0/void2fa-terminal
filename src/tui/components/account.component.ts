import { generateHotpCode, generateTotpCode, getTotpRemaining } from "@/utils/account.utils.js";
import { HotpAccountEntity } from "@/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@/entities/totpAccount.entity.js";
import blessed from "blessed";
import clipboard from "clipboardy";
import { hideAlert, showAlert } from "../core/globalAlertBox.js";
import { hotpAccountRepository } from "@/repositories/hotpAccount.repository.js";

interface AccountProps {
  account: TotpAccountEntity | HotpAccountEntity;
  parent: blessed.Widgets.Node;
  top: number | string;
  left: number | string;
  width: number;
  height: number;
  backgroundColor: string;
  color: string;
}

export function accountComponent(props: AccountProps): void {
  const { parent, account, top, left, width, height, backgroundColor, color } = props;

  const accountBox = blessed.box({
    parent,
    width,
    height,
    top,
    left,
    border: "line",
    content: `Name: ${account.name}\nIssuer: ${account.issuer}`,
    style: {
      bg: backgroundColor,
      fg: color,
      border: {
        bg: backgroundColor,
        fg: color,
      },
    },
  });

  function setContent(code: string, text: string) {
    accountBox.setContent(`Name: ${account.name}\nIssuer: ${account.issuer}\nCode: ${code}\n${text}`);
  }

  if (account instanceof HotpAccountEntity) {
    setContent(generateHotpCode(account), `Counter: ${account.counter}`);

    accountBox.on("click", async () => {
      const code = generateHotpCode(account);
      await clipboard.write(code || "");

      account.counter++;

      await hotpAccountRepository.save(account);

      setContent(generateHotpCode(account), `Counter: ${account.counter}`);

      showAlert("Code copied to clipboard", "Success!");
      setTimeout(hideAlert, 2000);
    });
  }

  if (account instanceof TotpAccountEntity) {
    accountBox.on("click", async () => {
      const code = generateTotpCode(account);
      await clipboard.write(code || "");

      showAlert("Code copied to clipboard", "Success!");
      setTimeout(hideAlert, 2000);
    });

    const remaining = getTotpRemaining(account.period);
    const progressBar = "*".repeat(((width - 4) / 100) * (remaining / (account.period / 100)));

    setContent(generateTotpCode(account), `${remaining < 10 ? `0${remaining}` : remaining}: ${progressBar}`);
  }
}
