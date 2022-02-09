import React, { useRef, useEffect, Component, Ref, MutableRefObject } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClick<T extends MutableRefObject<any>>(
  ref: T,
  open: boolean,
  callback: () => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (open && ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideClick;
