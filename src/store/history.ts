import { JSX } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Status = "SUCCESS" | "FAILURE";

export type CommandHistory = {
	input: string;
	output?: string | JSX.Element;
	status: Status;
	time: Date;
	currentDirectory: string;
};

type State = {
	history: CommandHistory[];
};

type Actions = {
	addHistory: (history: CommandHistory) => void;
	clearHistory: () => void;
};

export type StoreType = {
	state: State;
	actions: Actions;
};

const historyStore = create<StoreType>()(
	immer((set) => ({
		state: {
			history: [],
		},
		actions: {
			addHistory: (history: CommandHistory) => {
				set((state) => {
					state.state.history.push(history);
				});
			},
			clearHistory: () => {
				set((state) => {
					state.state.history = [];
				});
			},
		},
	})),
);

export function useHistoryState() {
	return historyStore((selector) => selector.state);
}

export function useHistoryActions() {
	return historyStore((selector) => selector.actions);
}
