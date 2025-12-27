import { useState, useEffect, useRef } from 'react';

const useCountDown = (initialTime: number, interval: number = 1000) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setIsActive(true);
  };

  const reset = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= interval) {
            setIsActive(false);
            return 0;
          }
          return time - interval;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, interval]);

  return [timeLeft, { start, reset }] as const;
};

export default useCountDown;