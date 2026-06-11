import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Button, Select, MenuItem, FormControl, InputLabel,
  Box, Typography, Skeleton, Stack
} from "@mui/material";
import { useState } from "react";
import { useLeaveCalendar } from "../../hooks/useLeaveCalendar";

const STATUS_COLOR = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

export default function LeaveRequestList() {
  const { members, leaveRequests, loading, changeLeaveStatus, deleteLeave } = useLeaveCalendar();
  const [filterMember, setFilterMember] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = leaveRequests.filter((l) => {
    if (filterMember && l.teamMember?.id !== filterMember) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h6" mb={2}>Leave Requests</Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter by member</InputLabel>
          <Select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} label="Filter by member">
            <MenuItem value="">Everyone</MenuItem>
            {members.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter by status</InputLabel>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Filter by status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell>Name</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && [...Array(3)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(6)].map((_, j) => (
                  <TableCell key={j}><Skeleton /></TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No results found</TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((l) => (
              <TableRow key={l.id} hover>
                <TableCell>{l.teamMember?.name}</TableCell>
                <TableCell>{l.startDate}</TableCell>
                <TableCell>{l.endDate}</TableCell>
                <TableCell>{l.reason}</TableCell>
                <TableCell>
                  <Chip label={l.status} color={STATUS_COLOR[l.status]} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    {l.status === "PENDING" && (
                      <>
                        <Button size="small" color="success" onClick={() => changeLeaveStatus(l.id, "APPROVED")}>Approve</Button>
                        <Button size="small" color="error" onClick={() => changeLeaveStatus(l.id, "REJECTED")}>Reject</Button>
                      </>
                    )}
                    <Button size="small" color="inherit" onClick={() => deleteLeave(l.id)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}