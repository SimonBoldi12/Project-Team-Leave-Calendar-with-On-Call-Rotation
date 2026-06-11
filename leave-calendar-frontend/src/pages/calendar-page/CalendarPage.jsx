import { Box, Typography, CircularProgress } from "@mui/material";
import CalendarView from "../../components/calendar-view/CalendarView";
import { useLeaveCalendar } from "../../hooks/useLeaveCalendar";

export default function CalendarPage() {
  const { leaveRequests, onCallSchedule, loading } = useLeaveCalendar();

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    
    <Box>
      
      <Typography variant="h5" mb={3}>Calendar View</Typography>
      <CalendarView leaves={leaveRequests} schedule={onCallSchedule} />
    </Box>
  );
}
