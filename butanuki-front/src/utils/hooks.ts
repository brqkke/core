import React from "react";

export const useEffectOnce = (effect: React.EffectCallback) => {
  const ref = React.useRef(false);
  if (!ref.current) {
    ref.current = true;
    return effect();
  }
};
