import { useEffect } from "react";
import { useState } from "react";
import { createLeaveRequest, deleteLeaveRequest, getLeaveRequests, getMembers, getOnCallSchedule, updateLeaveStatus } from "../api/api";
import toast from "react-hot-toast";
import { LeaveCalendarContext } from "./LeaveCalendarContext";

export function LeaveCalendarProvider({ children }) {
    const [members, setMembers] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [onCallSchedule, setOnCallSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOnCallSchedule = (fromDate, weeks = 8) => {
        return getOnCallSchedule(fromDate, weeks)
            .then((data) => setOnCallSchedule(data))
            .catch(() => toast.error("Failed to update on-call schedule!"));
    };

    const refreshAllData = () => {
        setLoading(true);
        getMembers()
            .then((data) => setMembers(data))
            .catch(() => toast.error("Failed to load members!"));
        getLeaveRequests()
            .then((data) => setLeaveRequests(data))
            .catch(() => toast.error("Failed to load leave requests!"))
            .finally(() => setLoading(false));
        fetchOnCallSchedule("2026-01-01", 156);
    };

    const createLeave = (formData) => {
        return createLeaveRequest(formData)
            .then((newLeave) => {
                setLeaveRequests((prev) => [...prev, newLeave]);
                toast.success("Leave request submitted successfully!");
                return true;
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Error occurred while saving!";
                toast.error(errorMsg);
                return false;
            });
    };

    const changeLeaveStatus = (id, status) => {
        return updateLeaveStatus(id, status)
            .then((updatedLeave) => {
                setLeaveRequests((prev) =>
                    prev.map((req) => (req.id === id ? updatedLeave : req))
                );
                toast.success(`Status updated to ${status}`);
                return fetchOnCallSchedule("2026-01-01", 156);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Failed to update status!";
                toast.error(errorMsg);
            });
    };

    const deleteLeave = (id) => {
    deleteLeaveRequest(id)
        .then(() => {
            setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
            toast.success("Leave request deleted successfully.");
            fetchOnCallSchedule("2026-01-01", 156);
        })
        .catch(() => toast.error("Failed to delete leave request!"));
    };

    useEffect(() => {
        refreshAllData();
    }, []);

    const contextValue = {
        members,
        leaveRequests,
        onCallSchedule,
        loading,
        refreshAllData,
        fetchOnCallSchedule,
        createLeave,
        changeLeaveStatus,
        deleteLeave
    };

    return (
        <LeaveCalendarContext.Provider value={contextValue}>
            {children}
        </LeaveCalendarContext.Provider>
    );
}