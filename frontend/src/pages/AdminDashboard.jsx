import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    Clock3,
    LogOut,
    RefreshCw,
    Search,
    ShieldCheck,
    Sparkles,
    UsersRound
} from "lucide-react";

import api from "../services/api";
import Toast from "../components/Toast";
import DashboardSkeleton from "../components/DashboardSkeleton";

function AdminDashboard() {

    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [staff, setStaff] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    const [updatingId, setUpdatingId] = useState(null);

    const [toast, setToast] = useState(null);

    const adminName =
        localStorage.getItem("userName") ||
        "Administrator";

    const adminEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email") ||
        "";

    /* =========================================================
       TOAST
       ========================================================= */

    const showToast = (type, message) => {

        setToast({
            type,
            message
        });

        window.setTimeout(() => {
            setToast(null);
        }, 3200);
    };

    /* =========================================================
       FETCH DASHBOARD DATA
       ========================================================= */

    const fetchDashboardData = async (
        showRefreshToast = false
    ) => {

        setLoading(true);
        setError("");

        try {

            const [
                complaintResponse,
                staffResponse
            ] = await Promise.all([
                api.get("/admin/complaints"),
                api.get("/admin/staff")
            ]);

            setComplaints(
                complaintResponse.data || []
            );

            setStaff(
                staffResponse.data || []
            );

            if (showRefreshToast) {

                showToast(
                    "success",
                    "Admin dashboard data refreshed successfully."
                );
            }

        } catch (err) {

            console.error(err);

            const message =
                err.response?.data?.message ||
                "Unable to load admin dashboard.";

            setError(message);

            if (showRefreshToast) {

                showToast(
                    "error",
                    message
                );
            }

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchDashboardData();

    }, []);

    /* =========================================================
       STATS
       ========================================================= */

    const stats = useMemo(() => {

        return {

            total: complaints.length,

            open: complaints.filter(
                complaint =>
                    complaint.status === "OPEN"
            ).length,

            active: complaints.filter(
                complaint =>
                    complaint.status === "ASSIGNED" ||
                    complaint.status === "IN_PROGRESS"
            ).length,

            resolved: complaints.filter(
                complaint =>
                    complaint.status === "RESOLVED" ||
                    complaint.status === "CLOSED"
            ).length

        };

    }, [complaints]);

    /* =========================================================
       FILTER COMPLAINTS
       ========================================================= */

    const filteredComplaints = useMemo(() => {

        return complaints.filter(
            complaint => {

                const query =
                    search
                        .trim()
                        .toLowerCase();

                const matchesSearch =
                    !query ||

                    complaint.title
                        ?.toLowerCase()
                        .includes(query) ||

                    complaint.description
                        ?.toLowerCase()
                        .includes(query) ||

                    complaint.category
                        ?.toLowerCase()
                        .includes(query) ||

                    complaint.location
                        ?.toLowerCase()
                        .includes(query) ||

                    complaint.residentName
                        ?.toLowerCase()
                        .includes(query);

                const matchesStatus =
                    statusFilter === "ALL" ||

                    (
                        statusFilter === "RESOLVED" &&
                        (
                            complaint.status === "RESOLVED" ||
                            complaint.status === "CLOSED"
                        )
                    ) ||

                    complaint.status === statusFilter;

                const matchesPriority =
                    priorityFilter === "ALL" ||
                    complaint.priority === priorityFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority
                );
            }
        );

    }, [
        complaints,
        search,
        statusFilter,
        priorityFilter
    ]);

    /* =========================================================
       ASSIGN STAFF
       ========================================================= */

    const assignStaff = async (
        complaintId,
        staffId
    ) => {

        if (!staffId) {
            return;
        }

        try {

            setUpdatingId(
                complaintId
            );

            const response =
                await api.patch(
                    `/admin/complaints/${complaintId}/assign`,
                    {
                        staffId:
                            Number(staffId)
                    }
                );

            setComplaints(
                previous =>
                    previous.map(
                        complaint =>
                            complaint.id === complaintId
                                ? response.data
                                : complaint
                    )
            );

            const selectedStaff =
                staff.find(
                    member =>
                        Number(member.id) ===
                        Number(staffId)
                );

            showToast(
                "success",
                selectedStaff
                    ? `${selectedStaff.name} has been assigned to complaint #${complaintId}.`
                    : `Staff assigned successfully to complaint #${complaintId}.`
            );

        } catch (err) {

            console.error(err);

            showToast(
                "error",
                err.response?.data?.message ||
                "Unable to assign staff."
            );

        } finally {

            setUpdatingId(null);
        }
    };

    /* =========================================================
       UPDATE PRIORITY
       ========================================================= */

    const updatePriority = async (
        complaintId,
        priority
    ) => {

        try {

            setUpdatingId(
                complaintId
            );

            const response =
                await api.patch(
                    `/admin/complaints/${complaintId}/priority`,
                    {
                        priority
                    }
                );

            setComplaints(
                previous =>
                    previous.map(
                        complaint =>
                            complaint.id === complaintId
                                ? response.data
                                : complaint
                    )
            );

            showToast(
                "success",
                `Complaint #${complaintId} priority changed to ${priority}.`
            );

        } catch (err) {

            console.error(err);

            showToast(
                "error",
                err.response?.data?.message ||
                "Unable to update priority."
            );

        } finally {

            setUpdatingId(null);
        }
    };

    /* =========================================================
       LOGOUT
       ========================================================= */

    const logout = () => {

        localStorage.clear();

        navigate("/login");
    };

    /* =========================================================
       HELPERS
       ========================================================= */

    const formatStatus = status => {

        if (!status) {
            return "";
        }

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );
    };

    const formatDate = date => {

        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getStatusIcon = status => {

        if (
            status === "RESOLVED" ||
            status === "CLOSED"
        ) {

            return (
                <CheckCircle2 size={14} />
            );
        }

        if (
            status === "ASSIGNED" ||
            status === "IN_PROGRESS"
        ) {

            return (
                <Clock3 size={14} />
            );
        }

        return (
            <AlertTriangle size={14} />
        );
    };

    /* =========================================================
       UI
       ========================================================= */

    return (

        <div className="premium-shell">

            {/* =================================================
                TOAST
                ================================================= */}

            {toast && (

                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() =>
                        setToast(null)
                    }
                />

            )}

            {/* =================================================
                SIDEBAR
                ================================================= */}

            <aside className="premium-sidebar">

                <div className="premium-logo-wrap">

                    <div className="premium-logo">
                        F
                    </div>

                    <div>

                        <h2>
                            FixFlow
                        </h2>

                        <p>
                            Operations console
                        </p>

                    </div>

                </div>

                <nav className="premium-nav">

                    <button
                        className={
                            statusFilter === "ALL"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setStatusFilter("ALL")
                        }
                    >

                        <ClipboardList size={18} />

                        Overview

                    </button>

                    <button
                        className={
                            statusFilter === "OPEN"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setStatusFilter("OPEN")
                        }
                    >

                        <AlertTriangle size={18} />

                        Unassigned

                    </button>

                    <button
                        className={
                            statusFilter === "IN_PROGRESS"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setStatusFilter(
                                "IN_PROGRESS"
                            )
                        }
                    >

                        <Clock3 size={18} />

                        In progress

                    </button>

                    <button
                        className={
                            statusFilter === "RESOLVED"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setStatusFilter(
                                "RESOLVED"
                            )
                        }
                    >

                        <CheckCircle2 size={18} />

                        Resolved

                    </button>

                    <button
                        className="premium-nav-item"
                    >

                        <UsersRound size={18} />

                        Staff

                    </button>

                </nav>

                <div className="premium-sidebar-footer">

                    <div className="premium-profile">

                        <div className="premium-avatar">

                            {adminName
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div className="premium-profile-text">

                            <strong>
                                {adminName}
                            </strong>

                            <span>
                                {adminEmail}
                            </span>

                        </div>

                    </div>

                    <button
                        className="premium-logout"
                        onClick={logout}
                    >

                        <LogOut size={17} />

                        Sign out

                    </button>

                </div>

            </aside>

            {/* =================================================
                MAIN
                ================================================= */}

            <main className="premium-main">

                <div className="premium-topbar">

                    <div>

                        <p className="premium-kicker">

                            <ShieldCheck size={15} />

                            Operations control

                        </p>

                        <h1>
                            Complaint management
                        </h1>

                        <p className="premium-subtitle">

                            Review civic issues,
                            prioritize requests,
                            assign field staff and
                            monitor resolution progress.

                        </p>

                    </div>

                    <button
                        className="premium-ghost-button"
                        onClick={() =>
                            fetchDashboardData(true)
                        }
                    >

                        <RefreshCw size={17} />

                        Refresh data

                    </button>

                </div>

                {/* =================================================
                    SUMMARY CARDS
                    ================================================= */}

                <section className="premium-summary-grid">

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setStatusFilter("ALL")
                        }
                    >

                        <span>
                            Total complaints
                        </span>

                        <strong>
                            {stats.total}
                        </strong>

                        <p>
                            All submitted issues
                        </p>

                    </button>

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setStatusFilter("OPEN")
                        }
                    >

                        <span>
                            Awaiting action
                        </span>

                        <strong>
                            {stats.open}
                        </strong>

                        <p>
                            Need administrative review
                        </p>

                    </button>

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setStatusFilter(
                                "IN_PROGRESS"
                            )
                        }
                    >

                        <span>
                            Active work
                        </span>

                        <strong>
                            {stats.active}
                        </strong>

                        <p>
                            Assigned or underway
                        </p>

                    </button>

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setStatusFilter(
                                "RESOLVED"
                            )
                        }
                    >

                        <span>
                            Resolved
                        </span>

                        <strong>
                            {stats.resolved}
                        </strong>

                        <p>
                            Successfully completed
                        </p>

                    </button>

                </section>

                {/* =================================================
                    COMPLAINT PANEL
                    ================================================= */}

                <section className="admin-premium-panel">

                    <div className="premium-section-head">

                        <div>

                            <h2>
                                Complaint queue
                            </h2>

                            <p>

                                {
                                    filteredComplaints.length
                                }

                                {" "}

                                complaint

                                {
                                    filteredComplaints.length !== 1
                                        ? "s"
                                        : ""
                                }

                            </p>

                        </div>

                        <div className="admin-filter-tools">

                            <div className="premium-search">

                                <Search size={17} />

                                <input
                                    type="text"
                                    placeholder="Search complaints..."
                                    value={search}
                                    onChange={
                                        event =>
                                            setSearch(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>

                            <div className="premium-select-wrap">

                                <select
                                    value={statusFilter}
                                    onChange={
                                        event =>
                                            setStatusFilter(
                                                event.target.value
                                            )
                                    }
                                >

                                    <option value="ALL">
                                        All statuses
                                    </option>

                                    <option value="OPEN">
                                        Open
                                    </option>

                                    <option value="ASSIGNED">
                                        Assigned
                                    </option>

                                    <option value="IN_PROGRESS">
                                        In progress
                                    </option>

                                    <option value="RESOLVED">
                                        Resolved
                                    </option>

                                    <option value="CLOSED">
                                        Closed
                                    </option>

                                </select>

                                <ChevronDown size={15} />

                            </div>

                            <div className="premium-select-wrap">

                                <select
                                    value={priorityFilter}
                                    onChange={
                                        event =>
                                            setPriorityFilter(
                                                event.target.value
                                            )
                                    }
                                >

                                    <option value="ALL">
                                        All priorities
                                    </option>

                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="CRITICAL">
                                        Critical
                                    </option>

                                </select>

                                <ChevronDown size={15} />

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        PREMIUM SKELETON LOADING
                        ================================================= */}

                    {loading && (

                        <DashboardSkeleton
                            rows={3}
                        />

                    )}

                    {/* =================================================
                        ERROR
                        ================================================= */}

                    {!loading &&
                        error && (

                        <div className="premium-error">

                            {error}

                        </div>

                    )}

                    {/* =================================================
                        EMPTY
                        ================================================= */}

                    {!loading &&
                        !error &&
                        filteredComplaints.length === 0 && (

                        <div className="premium-empty">

                            <div className="premium-empty-icon">

                                <Sparkles size={25} />

                            </div>

                            <h3>
                                No complaints found
                            </h3>

                            <p>

                                Try changing your
                                filters or search query.

                            </p>

                        </div>

                    )}

                    {/* =================================================
                        COMPLAINT LIST
                        ================================================= */}

                    {!loading &&
                        !error &&
                        filteredComplaints.length > 0 && (

                        <div className="admin-complaint-list">

                            {
                                filteredComplaints.map(
                                    complaint => (

                                        <article
                                            className="admin-premium-row"
                                            key={
                                                complaint.id
                                            }
                                        >

                                            <div className="admin-ticket-column">

                                                <span className="premium-issue-id">

                                                    ISSUE #

                                                    {
                                                        complaint.id
                                                    }

                                                </span>

                                                <div className="admin-title-line">

                                                    <h3>

                                                        {
                                                            complaint.title
                                                        }

                                                    </h3>

                                                    <span
                                                        className={
                                                            `premium-status status-${complaint.status?.toLowerCase()}`
                                                        }
                                                    >

                                                        {
                                                            getStatusIcon(
                                                                complaint.status
                                                            )
                                                        }

                                                        {
                                                            formatStatus(
                                                                complaint.status
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                                <p className="premium-description">

                                                    {
                                                        complaint.description
                                                    }

                                                </p>

                                                <div className="premium-meta-row">

                                                    <span>

                                                        {
                                                            complaint.category
                                                        }

                                                    </span>

                                                    <span>

                                                        {
                                                            complaint.location
                                                        }

                                                    </span>

                                                    <span>

                                                        Resident:
                                                        {" "}

                                                        {
                                                            complaint.residentName
                                                        }

                                                    </span>

                                                    <span>

                                                        {
                                                            formatDate(
                                                                complaint.createdAt
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                            <div className="admin-control-column">

                                                <label>
                                                    Priority
                                                </label>

                                                <div className="admin-control-select">

                                                    <select
                                                        value={
                                                            complaint.priority
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            complaint.id
                                                        }
                                                        onChange={
                                                            event =>
                                                                updatePriority(
                                                                    complaint.id,
                                                                    event.target.value
                                                                )
                                                        }
                                                    >

                                                        <option value="LOW">
                                                            Low
                                                        </option>

                                                        <option value="MEDIUM">
                                                            Medium
                                                        </option>

                                                        <option value="HIGH">
                                                            High
                                                        </option>

                                                        <option value="CRITICAL">
                                                            Critical
                                                        </option>

                                                    </select>

                                                    <ChevronDown size={14} />

                                                </div>

                                                <label>
                                                    Assigned staff
                                                </label>

                                                <div className="admin-control-select">

                                                    <select
                                                        value={
                                                            complaint.assignedStaffId ||
                                                            ""
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                                complaint.id ||
                                                            complaint.status ===
                                                                "RESOLVED" ||
                                                            complaint.status ===
                                                                "CLOSED"
                                                        }
                                                        onChange={
                                                            event =>
                                                                assignStaff(
                                                                    complaint.id,
                                                                    event.target.value
                                                                )
                                                        }
                                                    >

                                                        <option value="">
                                                            Select staff
                                                        </option>

                                                        {
                                                            staff.map(
                                                                member => (

                                                                    <option
                                                                        key={
                                                                            member.id
                                                                        }
                                                                        value={
                                                                            member.id
                                                                        }
                                                                    >

                                                                        {
                                                                            member.name
                                                                        }

                                                                    </option>

                                                                )
                                                            )
                                                        }

                                                    </select>

                                                    <ChevronDown size={14} />

                                                </div>

                                                {
                                                    complaint.assignedStaffName && (

                                                        <div className="assigned-person">

                                                            <div className="assigned-avatar">

                                                                {
                                                                    complaint
                                                                        .assignedStaffName
                                                                        .charAt(0)
                                                                        .toUpperCase()
                                                                }

                                                            </div>

                                                            <div>

                                                                <span>
                                                                    Assigned to
                                                                </span>

                                                                <strong>

                                                                    {
                                                                        complaint.assignedStaffName
                                                                    }

                                                                </strong>

                                                            </div>

                                                        </div>

                                                    )
                                                }

                                                {
                                                    updatingId ===
                                                    complaint.id && (

                                                        <span className="saving-state">

                                                            Saving changes...

                                                        </span>

                                                    )
                                                }

                                            </div>

                                        </article>

                                    )
                                )
                            }

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;