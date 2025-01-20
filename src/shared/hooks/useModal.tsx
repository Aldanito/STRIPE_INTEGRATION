import { useState } from "react";

export const useModal = (): { open: boolean; toggle: () => void } => {
  const [open, setOpen] = useState<boolean>(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return {
    open,
    toggle,
  };
};
