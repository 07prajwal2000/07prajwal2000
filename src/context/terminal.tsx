import { CliParser } from "@/lib/cliParser";
import { createContext, useContext } from "react";

export type TerminalContextType = {
	cliParser: CliParser;
};

export const IGNORED_COMMANDS = ["clear"];

const TerminalContext = createContext<TerminalContextType>(null as any);

export function useTerminalContext() {
	return useContext(TerminalContext);
}

export const TerminalProvider = TerminalContext.Provider;
