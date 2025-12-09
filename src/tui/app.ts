import { globalEvents } from "@/tui/core/globalEvents.js";
import { pagesHandler } from "@/tui/core/pagesHandler.js";
import { mainScreen } from "@/tui/core/screen.js";

export function app() {
  globalEvents();
  pagesHandler();

  mainScreen.emit("app:page.change", "home");
}
