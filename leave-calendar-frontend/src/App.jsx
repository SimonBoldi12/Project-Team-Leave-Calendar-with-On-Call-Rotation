import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import LeavesPage from "./pages/leaves-page/LeavesPage";
import OnCallPage from "./pages/on-call-page/OnCallPage";
import CalendarPage from "./pages/calendar-page/CalendarPage";

function Navbar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Leave Requests" },
    { to: "/oncall", label: "On-Call Schedule" },
    { to: "/calendar", label: "Calendar" },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Team Leave Calendar
        </Typography>
        {links.map((l) => (
          <Button
            key={l.to}
            component={Link}
            to={l.to}
            color="inherit"
            sx={{
              fontWeight: location.pathname === l.to ? "bold" : "normal",
              borderBottom: location.pathname === l.to ? "2px solid white" : "none",
            }}
          >
            {l.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<LeavesPage />} />
          <Route path="/oncall" element={<OnCallPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}