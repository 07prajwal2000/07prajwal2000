import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
	currentDirectory: string;
	time: Date;
	inputContent: string;
};

type Actions = {
	time: {
		setTime(date: Date): void;
		getFormatted(currentDate: Date): string;
	};
};

type StoreType = {
	state: State;
	actions: Actions;
};

const globalStore = create<StoreType>()(
	immer((set, get) => ({
		state: {
			currentDirectory: "/home",
			time: new Date(),
			inputContent: "",
		},
		actions: {
			time: {
				setTime(time: Date) {
					set((state) => {
						state.state.time = time;
					});
				},
				getFormatted(currentDate: Date) {
					const hour = currentDate.getHours();
					const minutes = currentDate.getMinutes();
					const cycle = hour >= 12 ? "PM" : "AM";
					return `${hour % 12 || 12}:${minutes < 10 ? "0" + minutes : minutes} ${cycle}`;
				},
			},
		},
	})),
);

export function useGlobalState() {
	return globalStore((selector) => selector.state);
}

export function useGlobalActions() {
	return globalStore((selector) => selector.actions);
}
