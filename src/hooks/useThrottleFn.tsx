import { useCallback, useRef } from "react";

export function useThrottleFn<T extends (...args: any[]) => void>(
	fn: T,
	delay: number,
): T {
	const lastExecuted = useRef(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const latestArgs = useRef<any[]>([]);

	return useCallback(
		((...args: any[]) => {
			const now = Date.now();
			const remaining = delay - (now - lastExecuted.current);
			latestArgs.current = args;

			if (remaining <= 0) {
				lastExecuted.current = now;
				fn(...args);
			} else if (!timeoutRef.current) {
				timeoutRef.current = setTimeout(() => {
					lastExecuted.current = Date.now();
					timeoutRef.current = null;
					fn(...latestArgs.current);
				}, remaining);
			}
		}) as T,
		[fn, delay],
	);
}
