import React, { useEffect } from "react";

export const useEffectOnce = (effect: React.EffectCallback) => {
  const effectRef = React.useRef(effect);
  effectRef.current = effect;
  useEffect(() => {
    const timeout = setTimeout(effectRef.current, 100);
    return () => clearTimeout(timeout);
  }, []);
};

// useDebounce is a hook that returns a debounced version of the value passed to it.
// It skips the delay if the value is equals to the specified skipIfValueIs
//This is used to avoid blinking spinner when the loading is too fast
export const useDebounce = <T>(value: T, delay: number, skipIfValueIs?: T) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(
      () => {
        setDebouncedValue(value);
      },
      value === skipIfValueIs ? 0 : delay
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, skipIfValueIs]);
  return debouncedValue;
};
