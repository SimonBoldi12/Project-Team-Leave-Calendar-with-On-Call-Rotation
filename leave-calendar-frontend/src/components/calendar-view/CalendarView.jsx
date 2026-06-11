import { useState } from "react";
import { Box, Typography, Paper, Chip, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const STATUS_COLOR = {
  PENDING: "#fff9c4",
  APPROVED: "#c8e6c9",
  REJECTED: "#ffcdd2",
};

const GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "2px",
  width: "100%",
};

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isInRange(date, start, end) {
  const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return d >= start && d <= end;
}

function isOnCallWeek(date, schedule) {
  return schedule.find((w) => isInRange(date, w.weekStart, w.weekEnd));
}

function getLeavesForDay(date, leaves) {
  return leaves.filter((l) => isInRange(date, l.startDate, l.endDate));
}

export default function CalendarView({ leaves = [], schedule = [] }) {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton onClick={() => setCurrent(new Date(year, month - 1, 1))}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6">{MONTHS[month]} {year}</Typography>
        <IconButton onClick={() => setCurrent(new Date(year, month + 1, 1))}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        <Chip size="small" label="Pending" sx={{ bgcolor: STATUS_COLOR.PENDING }} />
        <Chip size="small" label="Approved" sx={{ bgcolor: STATUS_COLOR.APPROVED }} />
        <Chip size="small" label="Rejected" sx={{ bgcolor: STATUS_COLOR.REJECTED }} />
        <Chip size="small" label="On-Call week" sx={{ bgcolor: "#e3f2fd" }} />
        <Chip size="small" label="⚠ Conflict" sx={{ bgcolor: "#ffe0b2" }} />
      </Stack>

      <Box sx={{ ...GRID, mb: "2px" }}>
        {DAYS.map((d) => (
          <Box key={d} sx={{ textAlign: "center", py: 0.5 }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">{d}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={GRID}>
        {cells.map((date, i) => {
          if (!date) return <Box key={`empty-${i}`} sx={{ minHeight: 80 }} />;

          const dayLeaves = getLeavesForDay(date, leaves);
          const onCallWeek = isOnCallWeek(date, schedule);
          const onCallMemberId = onCallWeek?.onCallMember?.id;
          const hasConflict = onCallWeek != null &&
            dayLeaves.some((l) => l.status === "APPROVED" && l.teamMember?.id === onCallMemberId);
          const isToday = isSameDay(date, today);

          let bgColor = "inherit";
          if (hasConflict) bgColor = "#ffe0b2";
          else if (onCallWeek) bgColor = "#e3f2fd";

          return (
            <Paper
              key={date.toISOString()}
              variant="outlined"
              sx={{
                minHeight: 80,
                p: 0.5,
                bgcolor: bgColor,
                border: isToday ? "2px solid #1976d2" : "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              <Typography
                variant="caption"
                fontWeight={isToday ? "bold" : "normal"}
                color={isToday ? "primary" : "text.primary"}
              >
                {date.getDate()}
              </Typography>

              {onCallWeek && (
                <Typography variant="caption" display="block" color="info.main" fontSize="0.6rem" noWrap>
                  📞 {onCallWeek.onCallMember?.name}
                </Typography>
              )}

              {dayLeaves.map((l) => (
                <Box
                  key={l.id}
                  sx={{
                    bgcolor: STATUS_COLOR[l.status],
                    borderRadius: 0.5,
                    px: 0.3,
                    mt: 0.2,
                    fontSize: "0.6rem",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {l.teamMember?.name}
                </Box>
              ))}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}