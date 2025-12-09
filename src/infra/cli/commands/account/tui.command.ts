import { BaseCommand } from "../base.command.js";
import { app } from "@/infra/tui/app.js";

export const tuiCommand = new BaseCommand({
  name: "tui",
  arguments: [],
  description: "TUI",
  examples: [{ command: "tui", comment: "// Acesse tui mode" }],
  options: [],

  action: async () => {
    app();
  },
});
