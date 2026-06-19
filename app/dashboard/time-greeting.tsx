"use client";

import { useState } from "react";

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours <= 11) return "Good morning";
  if (hours >= 12 && hours <= 17) return "Good afternoon";
  return "Good evening";
};

export const TimeGreeting = () => {
  const [greeting] = useState(getGreeting);
  return <>{greeting}</>;
};
