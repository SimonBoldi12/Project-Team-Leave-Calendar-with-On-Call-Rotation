import { Box, Grid, Typography } from "@mui/material";
import LeaveRequestForm from "../../components/leave-request-form/LeaveRequestForm";
import LeaveRequestList from "../../components/leave-request-list/LeaveRequestList";

export default function LeavesPage() {
  return (
    <Box>
      <Typography variant="h5" mb={3}>Leave Requests</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <LeaveRequestForm />
        </Grid>
        <Grid item xs={12} md={7}>
          <LeaveRequestList />
        </Grid>
      </Grid>
    </Box>
  );
}
