import { mainScreen } from "@/tui/core/screen.js";

export function globalEvents(): void {
  mainScreen.key(["q", "C-c"], () => process.exit(0));
  mainScreen.on("app:render", () => {
    mainScreen.render();
  });
}
