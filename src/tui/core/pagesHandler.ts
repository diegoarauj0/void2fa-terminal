import { commandListComponent } from "@/tui/components/commandList.component.js";
import { createGlobalAlertBox, showAlert } from "@/tui/core/globalAlertBox.js";
import { accountsPage } from "@/tui/pages/accounts.page.js";
import { createPage } from "@/tui/pages/create.page.js";
import { homePage } from "@/tui/pages/home.page.js";
import { mainScreen } from "@/tui/core/screen.js";
import blessed from "blessed";

let currentPage: null | string = null;
let lockedPage: boolean = false;

interface Page {
  func: (container: blessed.Widgets.Node) => void | Promise<void>;
  keys?: string[];
}

const pages: Map<string, Page> = new Map();

pages.set("home", { keys: ["f1"], func: homePage });
pages.set("accounts", { keys: ["f2"], func: accountsPage });
pages.set("create", { keys: ["f3"], func: createPage });

function setupLayout(): void {
  commandListComponent({
    backgroundColor: "black",
    color: "magenta",
    pagesShortcut: true,
    parent: mainScreen,
    pages,
  });
  createGlobalAlertBox();
}

export function pagesHandler(): void {
  const pageContainer = blessed.box({
    parent: mainScreen,
    height: "100%",
    width: "100%",
    style: {
      bg: "black",
    },
  });

  const exportsListEvents: string[] = ["resize", "keypress"];

  exportsListEvents.forEach((eventName) => {
    mainScreen.on(eventName, (...args) => {
      mainScreen.emit(`app:page.${eventName}`, ...args);
    });
  });

  pages.forEach(({ keys }, name) => {
    if (keys) mainScreen.key(keys, () => mainScreen.emit("app:page.change", name));
  });

  mainScreen.on("page:lock", () => {
    lockedPage = true;
  });

  mainScreen.on("page:unlock", () => {
    lockedPage = false;
  });

  mainScreen.on("app:page.close", () => {
    if (lockedPage) return;

    exportsListEvents.forEach((eventName) => {
      mainScreen.removeAllListeners(`app:page.${eventName}`);
    });

    pageContainer.children.forEach((element) => {
      element.destroy();
    });

    currentPage = null;
  });

  mainScreen.on("app:page.change", async (name: string) => {
    if (lockedPage) return;

    if (currentPage === name) {
      showAlert(`You are now on the "${name}" page!`, "Waring!");
      return;
    }

    const pageFn = pages.get(name);

    if (pageFn === undefined) return;

    mainScreen.emit("app:page.close", currentPage);

    currentPage = name;

    await pageFn.func(pageContainer);

    setupLayout();

    mainScreen.render();
  });
}
