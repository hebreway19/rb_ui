import React from "react";
import { Calendar } from "./Calendar";
import { useMediaQuery } from "react-responsive";
import { MobileCalendar } from "./MobileCalendar";

export const LessonCalendar = () => {
  const isTabletOrMobile = useMediaQuery({query: "(max-width: 768px)"});
  return (isTabletOrMobile ? <MobileCalendar /> : <Calendar />);
}