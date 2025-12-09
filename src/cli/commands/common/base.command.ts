import { logger } from "@/utils/logger.js";
import { Command } from "commander";

interface CreateBaseCommandProps {
  action: (this: Command, ...args: any[]) => void | Promise<void>;
  examples?: { command: string; comment?: string }[];
  options?: { name: string; description: string }[];
  arguments?: string[];
  description: string;
  name: string;
}

export class BaseCommand extends Command {
  constructor(props: CreateBaseCommandProps) {
    super(props.name);

    props.arguments?.forEach((argument) => {
      this.argument(argument);
    });

    let exampleText = "";

    props.examples?.forEach(({ command, comment }) => {
      exampleText += `${logger.formatExample(command, comment)}\n `;
    });

    this.description(`${props.description}\n ${exampleText}`);

    props.options?.forEach(({ name, description }) => {
      this.option(name, description);
    });

    this.action(props.action);
  }
}
