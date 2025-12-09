import blessed from "blessed";

interface CommandListProps {
  pages: Map<string, { keys?: string[] }>;
  parent: blessed.Widgets.Node;
  pagesShortcut: boolean;
  backgroundColor: string;
  color: string;
}

export function commandListComponent(props: CommandListProps) {
  const formatKey = (key: string) => {
    if (key.startsWith("C-")) return key.replace("C-", "Ctrl+");
    if (/^f\d$/i.test(key)) return `F${key[1]}`;

    return key;
  };

  let content: string = "";

  props.pages.forEach(({ keys }, name) => {
    content += ` ${name} > ${keys?.map((v) => formatKey(v))} |`;
  });

  const footerBox = blessed.box({
    parent: props.parent,
    width: "100%",
    height: "shrink",
    top: "99%",
    left: "0%",
    content,
    style: {
      bg: props.backgroundColor,
      fg: props.color,
    },
  });
}
