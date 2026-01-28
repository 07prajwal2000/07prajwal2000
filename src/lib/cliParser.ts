/**
 * CLI Args Parser with Trie Structure
 * Simplified implementation with proper tree handling and level-based suggestions
 */

import Table from "cli-table";

// Types and Interfaces
export type ExecutionStatus = "SUCCESS" | "FAILURE";

export interface CommandOption {
  short?: string;
  long: string;
  helpText: string;
  hasValue?: boolean;
  required?: boolean;
}

export interface ParsedOptions {
  [key: string]: string | boolean;
}

export interface ExecutorContext {
  commands: string[];
  values: { [placeholder: string]: string };
  options: ParsedOptions;
  args: string[];
  parser: CliParser;
}

export interface CommandConfig {
  executor?: (context: ExecutorContext) => any;
  helpText: string;
  options?: CommandOption[];
  children?: { [key: string]: CommandConfig };
}

export interface ParseResult {
  output: any;
  status: ExecutionStatus;
}

// Trie Node for command structure
class TrieNode {
  children: Map<string, TrieNode>;
  config: CommandConfig | null;
  commandName: string;
  isEndOfCommand: boolean;
  isValuePlaceholder: boolean;

  constructor(commandName: string = "") {
    this.children = new Map();
    this.config = null;
    this.commandName = commandName;
    this.isEndOfCommand = false;
    this.isValuePlaceholder =
      commandName.startsWith("<") && commandName.endsWith(">");
  }
}

// Command Trie
class CommandTrie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(commandPath: string[], config: CommandConfig): void {
    let current = this.root;

    for (const command of commandPath) {
      if (!current.children.has(command)) {
        current.children.set(command, new TrieNode(command));
      }
      current = current.children.get(command)!;
    }

    current.isEndOfCommand = true;
    current.config = config;
  }

  search(commandPath: string[]): {
    node: TrieNode | null;
    capturedValues: { [key: string]: string };
  } {
    let current = this.root;
    const capturedValues: { [key: string]: string } = {};

    for (const command of commandPath) {
      let found = false;

      // Try exact match first
      if (current.children.has(command)) {
        current = current.children.get(command)!;
        found = true;
      } else {
        // Try to find a value placeholder
        for (const [childKey, childNode] of current.children) {
          if (childNode.isValuePlaceholder) {
            capturedValues[childKey] = command;
            current = childNode;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        return { node: null, capturedValues: {} };
      }
    }

    return { node: current, capturedValues };
  }

  // Get commands at current level only
  getCommandsAtLevel(
    node: TrieNode = this.root,
    prefix: string[] = [],
  ): string[] {
    const commands: string[] = [];

    // Only return direct children
    for (const [commandName, childNode] of node.children) {
      commands.push([...prefix, commandName].join(" "));
    }

    return commands;
  }

  // Simple contains search at current level (case-insensitive)
  searchAtLevel(
    query: string,
    level: string[],
    maxResults: number = 10,
  ): string[] {
    // Navigate to the level
    const { node: levelNode } = this.search(level);

    if (!levelNode) {
      return [];
    }

    // Get all commands at this level
    const commandsAtLevel = this.getCommandsAtLevel(levelNode, level);
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    for (const command of commandsAtLevel) {
      const lastPart = command.split(" ").pop() || "";

      // Skip placeholders in suggestions
      if (lastPart.startsWith("<") && lastPart.endsWith(">")) {
        continue;
      }

      // Simple contains check (case-insensitive)
      if (lastPart.toLowerCase().includes(queryLower)) {
        suggestions.push(command);
      }
    }

    return suggestions.slice(0, maxResults);
  }
}

// CLI Builder
export class CliBuilder {
  private trie: CommandTrie;
  private currentPath: string[];

  constructor() {
    this.trie = new CommandTrie();
    this.currentPath = [];
  }

  addCommand(name: string, config: CommandConfig): this {
    this.currentPath = [name];
    this.trie.insert(this.currentPath, config);

    // Add children if provided
    if (config.children) {
      this.addChildrenRecursively(this.currentPath, config.children);
    }

    return this;
  }

  addSubCommand(name: string, config: CommandConfig): this {
    if (this.currentPath.length === 0) {
      throw new Error(
        "Cannot add subcommand without a parent command. Use addCommand first.",
      );
    }

    const newPath = [...this.currentPath, name];
    this.trie.insert(newPath, config);

    // Add children if provided
    if (config.children) {
      this.addChildrenRecursively(newPath, config.children);
    }

    // DO NOT update current path - keep it at parent level
    // This allows multiple addSubCommand calls to add siblings

    return this;
  }

  // Navigate into a subcommand to add children to it
  intoSubCommand(name: string): this {
    if (this.currentPath.length === 0) {
      throw new Error(
        "Cannot navigate into subcommand without a parent command.",
      );
    }

    // Update current path to the subcommand
    this.currentPath = [...this.currentPath, name];
    return this;
  }

  // Navigate back to parent command
  back(): this {
    if (this.currentPath.length > 0) {
      this.currentPath = this.currentPath.slice(0, -1);
    }
    return this;
  }

  private addChildrenRecursively(
    parentPath: string[],
    children: { [key: string]: CommandConfig },
  ): void {
    for (const [childName, childConfig] of Object.entries(children)) {
      const childPath = [...parentPath, childName];
      this.trie.insert(childPath, childConfig);

      if (childConfig.children) {
        this.addChildrenRecursively(childPath, childConfig.children);
      }
    }
  }

  build(): CliParser {
    return new CliParser(this.trie);
  }
}

// CLI Parser
export class CliParser {
  private trie: CommandTrie;

  constructor(trie: CommandTrie) {
    this.trie = trie;
  }

  parse(input: string): ParseResult {
    try {
      const tokens = this.tokenize(input);
      if (tokens.length === 0) {
        return {
          output: "No command provided",
          status: "FAILURE",
        };
      }

      const extractResult = this.extractCommandPath(tokens);
      const { commandPath, remainingTokens, errorIndex } = extractResult;

      if (errorIndex !== -1) {
        const errorMessage = this.formatErrorWithCaret(
          input,
          tokens,
          errorIndex,
          "Command not found",
        );
        return {
          output: errorMessage,
          status: "FAILURE",
        };
      }

      const { node, capturedValues } = this.trie.search(commandPath);

      if (!node) {
        const errorMessage = this.formatErrorWithCaret(
          input,
          tokens,
          commandPath.length > 0 ? commandPath.length - 1 : 0,
          "Command not found",
        );
        return {
          output: errorMessage,
          status: "FAILURE",
        };
      }

      // Check if we have a valid command configuration
      if (!node.config) {
        const errorMessage = this.formatErrorWithCaret(
          input,
          tokens,
          commandPath.length - 1,
          "Command not found",
        );
        return {
          output: errorMessage,
          status: "FAILURE",
        };
      }

      // If no executor, check if there are children
      if (!node.config.executor) {
        if (node.children.size > 0) {
          const childrenList = Array.from(node.children.keys()).join(", ");
          return {
            output: `Available subcommands: ${childrenList}`,
            status: "FAILURE",
          };
        }
        return {
          output: "No executor defined for this command",
          status: "FAILURE",
        };
      }

      const { options, args } = this.parseOptionsAndArgs(
        remainingTokens,
        node.config.options || [],
      );

      // Validate required options
      const missingOptions = this.validateRequiredOptions(
        node.config.options || [],
        options,
      );
      if (missingOptions.length > 0) {
        return {
          output: `Missing required options: ${missingOptions.join(", ")}`,
          status: "FAILURE",
        };
      }

      const context: ExecutorContext = {
        commands: commandPath,
        values: capturedValues,
        options,
        args,
        parser: this,
      };

      const result = node.config.executor(context);

      return {
        output: result,
        status: "SUCCESS",
      };
    } catch (error) {
      return {
        output: error instanceof Error ? error.message : String(error),
        status: "FAILURE",
      };
    }
  }

  private formatErrorWithCaret(
    input: string,
    tokens: string[],
    errorIndex: number,
    errorMessage: string,
  ): string {
    if (errorIndex < 0 || errorIndex >= tokens.length) {
      return `${errorMessage}: ${input}`;
    }

    // Find the position of the error token in the original input
    let currentTokenIndex = 0;
    let errorStartPos = 0;
    let errorEndPos = 0;
    let inQuotes = false;
    let quoteChar = "";
    let charsSoFar = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
        if (currentTokenIndex === errorIndex) {
          errorStartPos = i;
        }
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        if (currentTokenIndex === errorIndex) {
          errorEndPos = i + 1;
          break;
        }
        quoteChar = "";
        currentTokenIndex++;
      } else if (!inQuotes && char === " ") {
        if (i > 0 && input[i - 1] !== " ") {
          if (currentTokenIndex === errorIndex) {
            errorEndPos = i;
            break;
          }
          currentTokenIndex++;
        }
      } else if (
        !inQuotes &&
        currentTokenIndex === errorIndex &&
        errorStartPos === 0
      ) {
        errorStartPos = i;
      }
    }

    if (errorEndPos === 0) {
      errorEndPos = input.length;
    }

    // Create the error message with caret
    const lines: string[] = [];
    lines.push(errorMessage);
    lines.push(input);

    const caretLine =
      " ".repeat(errorStartPos) +
      "^".repeat(Math.max(1, errorEndPos - errorStartPos));
    lines.push(caretLine);

    return lines.join("\n");
  }

  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = "";
      } else if (char === " " && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }

    if (current) {
      tokens.push(current);
    }

    return tokens;
  }

  private extractCommandPath(tokens: string[]): {
    commandPath: string[];
    remainingTokens: string[];
    errorIndex: number;
  } {
    const commandPath: string[] = [];
    let i = 0;
    let currentNode = this.trie.root;

    while (i < tokens.length && !tokens[i].startsWith("-")) {
      const token = tokens[i];
      let found = false;

      // Try exact match first
      if (currentNode.children.has(token)) {
        commandPath.push(token);
        currentNode = currentNode.children.get(token)!;
        found = true;
      } else {
        // Try to find a value placeholder
        for (const [childKey, childNode] of currentNode.children) {
          if (childNode.isValuePlaceholder) {
            commandPath.push(token);
            currentNode = childNode;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        // Check if we've found a valid command so far
        if (commandPath.length > 0 && currentNode.isEndOfCommand) {
          // We have a valid command, stop here
          break;
        }
        // Invalid command path
        return {
          commandPath,
          remainingTokens: tokens.slice(i),
          errorIndex: i,
        };
      }

      i++;
    }

    return {
      commandPath,
      remainingTokens: tokens.slice(i),
      errorIndex: -1,
    };
  }

  private parseOptionsAndArgs(
    tokens: string[],
    optionConfigs: CommandOption[],
  ): { options: ParsedOptions; args: string[] } {
    const options: ParsedOptions = {};
    const args: string[] = [];
    const optionMap = this.buildOptionMap(optionConfigs);

    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];

      if (token.startsWith("-")) {
        const optionConfig = optionMap.get(token);

        if (optionConfig) {
          if (optionConfig.hasValue) {
            if (i + 1 < tokens.length && !tokens[i + 1].startsWith("-")) {
              options[optionConfig.long] = tokens[i + 1];
              i += 2;
            } else {
              throw new Error(`Option ${token} requires a value`);
            }
          } else {
            options[optionConfig.long] = true;
            i++;
          }
        } else {
          throw new Error(`Unknown option: ${token}`);
        }
      } else {
        args.push(token);
        i++;
      }
    }

    return { options, args };
  }

  private buildOptionMap(
    optionConfigs: CommandOption[],
  ): Map<string, CommandOption> {
    const map = new Map<string, CommandOption>();

    for (const config of optionConfigs) {
      map.set(config.long, config);
      if (config.short) {
        map.set(config.short, config);
      }
    }

    return map;
  }

  private validateRequiredOptions(
    optionConfigs: CommandOption[],
    providedOptions: ParsedOptions,
  ): string[] {
    const missing: string[] = [];

    for (const config of optionConfigs) {
      if (config.required && !(config.long in providedOptions)) {
        missing.push(config.long);
      }
    }

    return missing;
  }

  getSuggestions(query: string, maxResults: number = 10): string[] {
    // Tokenize the query to understand the level
    const tokens = this.tokenize(query.trim());

    if (tokens.length === 0) {
      // Return root level commands
      return this.trie
        .getCommandsAtLevel(this.trie.root, [])
        .slice(0, maxResults);
    }

    // Determine the level and search query
    const lastToken = tokens[tokens.length - 1];
    const levelTokens = tokens.slice(0, -1);

    // If query ends with space, show next level commands
    if (query.endsWith(" ")) {
      const { node } = this.trie.search(tokens);
      if (node) {
        return this.trie.getCommandsAtLevel(node, tokens).slice(0, maxResults);
      }
      return [];
    }

    // Search at the current level
    return this.trie.searchAtLevel(lastToken, levelTokens, maxResults);
  }

  getHelpText(): string {
    const table = new Table({
      head: ["Command", "Help text", "Options"],
      colWidths: [20, 70, 30],
      chars: {
        top: "",
        "top-mid": "",
        "top-left": "",
        "top-right": "",
        bottom: "",
        "bottom-mid": "",
        "bottom-left": "",
        "bottom-right": "",
        left: "",
        "left-mid": "",
        mid: "",
        "mid-mid": "",
        right: "",
        "right-mid": "",
        middle: " ",
      },
    });

    // Only get root level commands (direct children of root)
    for (const [commandName, childNode] of this.trie.root.children) {
      if (childNode.config) {
        const optionsStr = this.formatOptions(childNode.config.options || []);
        table.push([commandName, childNode.config.helpText, optionsStr]);
      }
    }

    return table.toString();
  }

  private getAllCommandPaths(node: TrieNode, prefix: string[]): string[][] {
    const commands: string[][] = [];

    if (node.isEndOfCommand) {
      commands.push([...prefix]);
    }

    for (const [commandName, childNode] of node.children) {
      commands.push(
        ...this.getAllCommandPaths(childNode, [...prefix, commandName]),
      );
    }

    return commands;
  }

  getCommandHelp(commandPath: string): string {
    const tokens = commandPath.split(" ");
    const { node } = this.trie.search(tokens);

    if (!node || !node.config) {
      return `Command not found: ${commandPath}`;
    }

    const table = new Table({
      colWidths: [20, 70],
      chars: {
        top: "",
        "top-mid": "",
        "top-left": "",
        "top-right": "",
        bottom: "",
        "bottom-mid": "",
        "bottom-left": "",
        "bottom-right": "",
        left: "",
        "left-mid": "",
        mid: "",
        "mid-mid": "",
        right: "",
        "right-mid": "",
        middle: " ",
      },
    });

    table.push(["Command", tokens.join(" ")]);
    table.push(["Description", node.config.helpText]);

    if (node.config.options && node.config.options.length > 0) {
      table.push(["Options", this.formatOptionsDetailed(node.config.options)]);
    }

    // Add subcommands if any
    if (node.children.size > 0) {
      const subcommands = Array.from(node.children.keys()).join(", ");
      table.push(["Subcommands", subcommands]);
    }

    return table.toString();
  }

  private formatOptions(options: CommandOption[]): string {
    if (options.length === 0) return "None";

    return options
      .map((opt) => {
        const short = opt.short ? `${opt.short}, ` : "";
        return `${short}${opt.long}`;
      })
      .join("\n");
  }

  private formatOptionsDetailed(options: CommandOption[]): string {
    return options
      .map((opt) => {
        const short = opt.short ? `${opt.short}, ` : "";
        const required = opt.required ? " (required)" : "";
        const hasValue = opt.hasValue ? " <value>" : "";
        return `${short}${opt.long}${hasValue}${required}\n  ${opt.helpText}`;
      })
      .join("\n\n");
  }
}
