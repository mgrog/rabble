import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function useTypingStatus(
  value: string,
  delay: number,
  statusSetter: (typing: boolean) => void,
  options?: {
    stop: boolean;
    setStop: (val: boolean) => void;
  },
): string {
  const [debouncedValue, setDebouncedValue] = useState('');
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (options?.stop) {
      options?.setStop!(false);
      statusSetter(false);
      return;
    }

    if (value && !timerActive) {
      setDebouncedValue(value);
      statusSetter(true);
      setTimerActive(true);
    }

    const handler = setTimeout(() => {
      statusSetter(false);
      setTimerActive(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, stop]);
  return debouncedValue;
}

export default useTypingStatus;
