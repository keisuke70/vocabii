import { useEffect, useState } from 'react';

const isKeyboardInput = (elem: HTMLElement) =>
  (elem.tagName === 'INPUT' &&
    !['button', 'submit', 'checkbox', 'file', 'image'].includes(
      (elem as HTMLInputElement).type,
    )) ||
  elem.hasAttribute('contenteditable');

const useIsKeyboardOpen = () => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (!e.target) {
        return;
      }
      const target = e.target as HTMLElement;
      if (isKeyboardInput(target)) {
        setOpen(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (!e.target) {
        return;
      }
      const target = e.target as HTMLElement;
      if (isKeyboardInput(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return isOpen;
};

export default useIsKeyboardOpen;
