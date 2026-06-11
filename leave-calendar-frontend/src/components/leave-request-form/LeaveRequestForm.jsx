import { useState } from "react";
import {
  Button, MenuItem, Select, FormControl,
  InputLabel, TextField, Typography, Paper, Alert
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLeaveCalendar } from "../../hooks/useLeaveCalendar";

export default function LeaveRequestForm() {
  const { members = [], createLeave } = useLeaveCalendar();
  const [form, setForm] = useState({
    teamMemberId: "",
    startDate: null,
    endDate: null,
    reason: "",
  });
  const [validationError, setValidationError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError("");
  }

  async function handleSubmit() {
    if (!form.teamMemberId || !form.startDate || !form.endDate || !form.reason) {
      setValidationError("All fields are required.");
      return;
    }
    if (form.endDate.isBefore(form.startDate)) {
      setValidationError("End date cannot be before start date.");
      return;
    }
    setValidationError("");
    const success = await createLeave({
      teamMemberId: Number(form.teamMemberId),
      startDate: form.startDate.format("YYYY-MM-DD"),
      endDate: form.endDate.format("YYYY-MM-DD"),
      reason: form.reason,
    });
    if (success) {
      setForm({ teamMemberId: "", startDate: null, endDate: null, reason: "" });
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Typography variant="h6" mb={2}>New Leave Request</Typography>

        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>{validationError}</Alert>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Team Member</InputLabel>
          <Select name="teamMemberId" value={form.teamMemberId} onChange={handleChange} label="Team Member">
            {members.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Start Date"
          value={form.startDate}
          onChange={(val) => { setForm((prev) => ({ ...prev, startDate: val })); setValidationError(""); }}
          format="YYYY-MM-DD"
          slotProps={{
            textField: { fullWidth: true, margin: "normal" }
          }}
        />

        <DatePicker
          label="End Date"
          value={form.endDate}
          minDate={form.startDate || undefined}
          onChange={(val) => { setForm((prev) => ({ ...prev, endDate: val })); setValidationError(""); }}
          format="YYYY-MM-DD"
          slotProps={{
            textField: { fullWidth: true, margin: "normal" }
          }}
        />

        <TextField
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }} fullWidth>
          Submit
        </Button>
      </Paper>
    </LocalizationProvider>
  );
}