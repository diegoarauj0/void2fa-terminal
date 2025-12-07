import { mainScreen } from "../core/screen.js";
import { config } from "@/config.js";
import blessed from "blessed";
import figlet from "figlet";

interface AppNameProps {
  parent: blessed.Widgets.Node;
  backgroundColor: string;
  color: string;
}

export async function appNameComponent(props: AppNameProps) {
  let currentFontIndex = 0;
  const fonts = ["Slant", "Stop", "Star Wars", "Soft", "Elite", "3D-ASCII"];

  const content = await figlet.text(`${config.name}`, { font: fonts[currentFontIndex] || "Slant" });

  const box = blessed.box({
    parent: props.parent,
    width: "100%",
    height: "shrink",
    top: "center",
    left: "center",
    style: {
      bg: props.backgroundColor,
      fg: props.color,
    },
  });

  const title = blessed.box({
    parent: box,
    width: "shrink",
    height: "shrink",
    top: "center",
    left: "center",
    content: `${content}`,
    style: {
      bg: props.backgroundColor,
      fg: props.color,
    },
  });

  blessed.box({
    parent: box,
    width: "shrink",
    height: "shrink",
    top: "75%",
    left: "center",
    content: `${config.version} A TUI tool for managing 2FA authentication accounts.`,
    style: {
      bg: props.backgroundColor,
      fg: props.color,
    },
  });

  const internalID = setInterval(async () => {
    currentFontIndex = currentFontIndex >= fonts.length ? 1 : currentFontIndex + 1;
    title.content = await figlet.text(`${config.name}`, { font: fonts[currentFontIndex] || "Slant" });
    mainScreen.emit("app:render");
  }, 1000);

  return { box, internalID };
}
