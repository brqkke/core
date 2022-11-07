import React, { useEffect } from "react";

export const useEffectOnce = (effect: React.EffectCallback) => {
  const ref = React.useRef(false);
  console.log("useEffectOnce", ref.current);
  console.trace();
  return useEffect(() => {
    const timeout = setTimeout(() => {
      if (!ref.current) {
        ref.current = true;
      }
      effect();
    }, 0);
    return () => clearTimeout(timeout);
  }, []);
};
