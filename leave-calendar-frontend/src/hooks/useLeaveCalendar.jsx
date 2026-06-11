import { useContext } from "react";
import { LeaveCalendarContext } from "../contexts/LeaveCalendarContext";

export function useLeaveCalendar() {
    const context = useContext(LeaveCalendarContext);
    if (!context) {
        throw new Error("useLeaveCalendar must be used within a LeaveCalendarProvider");
    }
    return context.contextValue ?? context;
}