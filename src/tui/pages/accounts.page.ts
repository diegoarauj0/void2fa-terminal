import { backgroundColorComponent } from "@/tui/components/backgroundColor.component.js";
import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { accountComponent } from "@/tui/components/account.component.js";
import { accountRepository } from "@/repositories/account.repository.js";
import { hideAlert, showAlert } from "@/tui/core/globalAlertBox.js";
import { otpService } from "@/services/otp.service.js";
import { mainScreen } from "@/tui/core/screen.js";
import clipboard from "clipboardy";
import blessed from "blessed";

export async function accountsPage(container: blessed.Widgets.Node) {
  const currentPosition = { positionX: 0, positionY: 0 };

  let accounts = await accountRepository.findAll();
  let accountsGrid: { positionX: number; positionY: number; accountIndex: number }[] = [];
  let lineBreak = 0;
  let scroll = 0;

  const accountsBox = blessed.box({
    parent: container,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    keys: true,
    mouse: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      style: {
        bg: "black",
      },
    },
    style: {
      bg: "black",
    },
  });

  backgroundColorComponent({ backgroundColor: "black", parent: accountsBox });

  const intervalID = setInterval(() => {
    render();
    mainScreen.emit("app:render");
  }, 500);

  mainScreen.once("app:page.close", () => {
    clearInterval(intervalID);
  });

  mainScreen.on("app:page.keypress", async (_, { name }) => {
    let positionX = currentPosition.positionX;
    let positionY = currentPosition.positionY;

    const grid = accountsGrid.filter((v) => v.positionX === positionX && v.positionY === positionY)[0];

    const account = accounts[grid?.accountIndex ?? -1];

    if (name === "delete" && account !== undefined) {
      if (account instanceof TotpAccountEntity) {
        await accountRepository.delete(account);
      }

      if (account instanceof HotpAccountEntity) {
        await accountRepository.delete(account);
      }

      accounts = accounts.filter((v) => v.id !== account.id);

      showAlert(`"${account.name.toValue()}" Account deleted`, "Success!");
      setTimeout(hideAlert, 2000);

      currentPosition.positionX = 0;
      currentPosition.positionY = 0;
      scroll = 0;
      accountsBox.scrollTo(scroll);

      render();

      mainScreen.emit("app:render");
    }

    if (name === "enter" && account !== undefined) {
      if (account instanceof TotpAccountEntity) {
        const code = otpService.generateTotpCode(account);
        await clipboard.write(code || "");
      }

      if (account instanceof HotpAccountEntity) {
        const code = otpService.generateHotpCode(account);
        await clipboard.write(code || "");

        account.addCounter();

        await accountRepository.save(account);
      }

      showAlert("Code copied to clipboard", "Success!");
      setTimeout(hideAlert, 2000);
    }

    const moves: { [key: string]: { dx: number; dy: number; keys: string[] } } = {
      left: { dx: -1, dy: 0, keys: ["left", "a"] },
      right: { dx: 1, dy: 0, keys: ["right", "d"] },
      up: { dx: 0, dy: -1, keys: ["up", "w"] },
      down: { dx: 0, dy: 1, keys: ["down", "s"] },
    };

    const move = Object.values(moves).filter((v) => v.keys.indexOf(name) !== -1)[0];
    if (!move) return;

    const newX = positionX + move.dx;
    const newY = positionY + move.dy;

    if (newY < 0) return;

    if (newX < 0) return;

    const exists = accountsGrid.some((v) => v.positionX === newX && v.positionY === newY);
    if (!exists) return;

    currentPosition.positionX = newX;
    currentPosition.positionY = newY;

    if (Number(mainScreen.height.valueOf()) + scroll < currentPosition.positionY * 6 + 6) {
      scroll += 6;
    }

    if (scroll > currentPosition.positionY * 6) {
      scroll -= 6;
    }

    accountsBox.scrollTo(scroll);

    render();

    mainScreen.emit("app:render");
  });

  mainScreen.on("app:page.resize", async () => {
    currentPosition.positionX = 0;
    currentPosition.positionY = 0;
    scroll = 0;
    accountsBox.scrollTo(scroll);

    render();
  });

  const render = () => {
    lineBreak = 3;

    if (Number(mainScreen.width.valueOf()) <= 150) {
      lineBreak = 2;
    }

    if (Number(mainScreen.width.valueOf()) <= 100) {
      lineBreak = 1;
    }

    accountsGrid = [];

    accountsBox.children.forEach((element) => {
      element.destroy();
    });

    backgroundColorComponent({ backgroundColor: "black", parent: accountsBox });

    if (accounts.length === 0) {
      blessed.box({
        parent: container,
        content: "No accounts were saved.",
        width: "shrink",
        height: "shrink",
        top: "center",
        left: "center",
        style: {
          fg: "magenta",
          bg: "black",
        },
      });

      return;
    }

    let positionX = 0;
    let positionY = 0;

    accounts.forEach((account, index) => {
      const current = positionX === currentPosition.positionX && positionY === currentPosition.positionY;

      accountsGrid.push({ positionX, positionY, accountIndex: index });

      accountComponent({
        account,
        parent: accountsBox,
        left: positionX * Math.round(Number(mainScreen.width.valueOf()) / lineBreak),
        top: positionY * 6,
        height: 6,
        width: Math.round(Number(mainScreen.width.valueOf()) / lineBreak),
        backgroundColor: "black",
        color: current ? "green" : "magenta",
      });

      positionX++;

      if (positionX === lineBreak) {
        positionX = 0;
        positionY++;
      }
    });
  };

  render();
}
