import { useState, useEffect } from "react";
import { timeAgo } from "@/common";

export const useTimeAgo = (initialTime: string) => {
  const [currentTimeAgo, setCurrentTimeAgo] = useState(timeAgo(initialTime));
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeAgo(timeAgo(initialTime));
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [initialTime]);
  return currentTimeAgo;
};
