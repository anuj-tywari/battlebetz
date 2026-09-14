import { useState, useEffect, useRef } from 'react';

type CountdownReturn = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function useCountdown(targetDate: Date): CountdownReturn {
  const [timeLeft, setTimeLeft] = useState<CountdownReturn>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Use ref to avoid recreating interval on every render
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        // Clear interval if target date has passed
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    };

    // Initial calculation
    calculateTimeLeft();

    // Set up interval
    timerRef.current = setInterval(calculateTimeLeft, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [targetDate]); // Only re-run if targetDate changes

  return timeLeft;
}