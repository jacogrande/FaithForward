import { getRandomLoadingMessage } from "@src/utils";
import { useEffect, useState } from "react";

export function useLoadingMessage(initialMessage: string) {
  const [ellipsis, setEllipsis] = useState("   ");
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter === 0) {
        setEllipsis("   ");
        setCounter(counter + 1);
      } else if (counter === 1) {
        setEllipsis(".  ");
        setCounter(counter + 1);
      } else if (counter === 2) {
        setEllipsis(".. ");
        setCounter(counter + 1);
      } else if (counter === 3) {
        setEllipsis("...");
        setCounter(0);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(getRandomLoadingMessage());
    }, 5000);
    return () => clearInterval(messageInterval);
  }, []);

  return `${message} ${ellipsis}`;
}
