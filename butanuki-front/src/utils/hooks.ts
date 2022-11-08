import React, { useEffect } from "react";

export const useEffectOnce = (effect: React.EffectCallback) => {
  return useEffect(() => {
    const timeout = setTimeout(effect, 100);
    return () => clearTimeout(timeout);
  }, []);
};
