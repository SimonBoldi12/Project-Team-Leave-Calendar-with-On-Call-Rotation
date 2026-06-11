import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Typography, Box, Alert, Skeleton
} from "@mui/material";
import { useLeaveCalendar } from "../../hooks/useLeaveCalendar";

export default function OnCallPage() {
  const { onCallSchedule, loading } = useLeaveCalendar();

  const today = new Date().toISOString().split('T')[0];
  const current = onCallSchedule.find(
    (w) => w.weekStart <= today && w.weekEnd >= today
  );

  return (
    <Box>
      <Typography variant="h5" mb={2}>On-Call Schedule</Typography>

      {current && (
        <Alert
          severity={current.hasConflict ? "warning" : "info"}
          sx={{ mb: 3 }}
        >
          {current.hasConflict
            ? `⚠️ This week ${current.onCallMember?.name} is on call but has approved leave!`
            : `✅ This week ${current.onCallMember?.name} is on call.`}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell>Week</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>On-Call</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && [...Array(8)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(5)].map((_, j) => (
                  <TableCell key={j}><Skeleton /></TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && onCallSchedule.map((week, i) => (
              <TableRow
                key={i}
                sx={{ bgcolor: week.hasConflict ? "warning.light" : "inherit" }}
              >
                <TableCell>{week.year} / Week {week.weekNumber}</TableCell>
                <TableCell>{week.weekStart}</TableCell>
                <TableCell>{week.weekEnd}</TableCell>
                <TableCell><strong>{week.onCallMember?.name}</strong></TableCell>
                <TableCell>
                  {week.hasConflict
                    ? <Chip label="⚠ On leave!" color="warning" size="small" />
                    : <Chip label="✓ Available" color="success" size="small" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}