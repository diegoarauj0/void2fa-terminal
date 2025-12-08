import { globalEvents } from "./core/globalEvents.js";
import { pagesHandler } from "./core/pagesHandler.js";
import { mainScreen } from "./core/screen.js";

export function app() {
  globalEvents();
  pagesHandler();

  mainScreen.emit("app:page.change", "accounts");
}
