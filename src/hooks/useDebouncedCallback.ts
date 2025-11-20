import { useEffect, useRef } from 'react';

type AnyFunction<Params extends unknown[]> = (...args: Params) => void;

const useDebouncedCallback = <Params extends unknown[]>(
	callback: AnyFunction<Params>,
	delay = 400,
) => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(
		() => () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		},
		[],
	);

	const debouncedFunction = (...args: Params) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			callbackRef.current(...args);
		}, delay);
	};

	return debouncedFunction;
};

export default useDebouncedCallback;

