import { config } from "@/config.js";
import blessed from "blessed";

export const mainScreen = blessed.screen({
  title: config.name,
  smartCSR: false,
});
