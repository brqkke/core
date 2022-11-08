import React, { useEffect } from "react";

export const useEffectOnce = (effect: React.EffectCallback) => {
  const effectRef = React.useRef(effect);
  effectRef.current = effect;
  useEffect(() => {
    const timeout = setTimeout(effectRef.current, 100);
    return () => clearTimeout(timeout);
  }, []);
};
