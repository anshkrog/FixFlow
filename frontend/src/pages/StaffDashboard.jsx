import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    CheckCircle2,
    ClipboardCheck,
    Clock3,
    LogOut,
    MapPin,
    RefreshCw,
    Search,
    Sparkles,
    UserRound,
    Wrench
} from "lucide-react";

import api from "../services/api";
import Toast from "../components/Toast";
import StaffSkeleton from "../components/StaffSkeleton";


function StaffDashboard() {

    const navigate = useNavigate();

    /* =========================================================
       STATE
       ========================================================= */

    const [complaints, setComplaints] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState("ALL");

    const [updatingId, setUpdatingId] =
        useState(null);

    const [toast, setToast] =
        useState(null);


    /* =========================================================
       USER INFORMATION
       ========================================================= */

    const staffName =
        localStorage.getItem("userName") ||
        "Field Staff";

    const staffEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email") ||
        "";


    /* =========================================================
       TOAST
       ========================================================= */

    const showToast = (
        type,
        message
    ) => {

        setToast({
            type,
            message
        });


        window.setTimeout(() => {

            setToast(null);

        }, 3200);
    };


    /* =========================================================
       FETCH ASSIGNED COMPLAINTS
       ========================================================= */

    const fetchComplaints = async (
        showRefreshToast = false
    ) => {

        setLoading(true);
        setError("");

        try {

            const response =
                await api.get(
                    "/staff/complaints"
                );


            setComplaints(
                response.data || []
            );


            if (showRefreshToast) {

                showToast(
                    "success",
                    "Your assigned tasks are up to date."
                );
            }

        } catch (err) {

            console.error(err);


            const message =
                err.response?.data?.message ||
                "Unable to load assigned complaints.";


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

        fetchComplaints();

    }, []);


    /* =========================================================
       STATISTICS
       ========================================================= */

    const stats =
        useMemo(() => {

            return {

                total:
                    complaints.length,


                assigned:
                    complaints.filter(
                        complaint =>
                            complaint.status ===
                            "ASSIGNED"
                    ).length,


                inProgress:
                    complaints.filter(
                        complaint =>
                            complaint.status ===
                            "IN_PROGRESS"
                    ).length,


                resolved:
                    complaints.filter(
                        complaint =>
                            complaint.status ===
                                "RESOLVED" ||
                            complaint.status ===
                                "CLOSED"
                    ).length

            };

        }, [complaints]);


    /* =========================================================
       FILTERED TASKS
       ========================================================= */

    const filteredComplaints =
        useMemo(() => {

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


                    const matchesFilter =
                        filter === "ALL" ||

                        complaint.status ===
                            filter ||

                        (
                            filter ===
                                "RESOLVED" &&

                            complaint.status ===
                                "CLOSED"
                        );


                    return (
                        matchesSearch &&
                        matchesFilter
                    );
                }
            );

        }, [
            complaints,
            search,
            filter
        ]);


    /* =========================================================
       UPDATE STATUS
       ========================================================= */

    const updateStatus = async (
        complaintId,
        newStatus
    ) => {

        try {

            setUpdatingId(
                complaintId
            );


            const response =
                await api.patch(
                    `/staff/complaints/${complaintId}/status`,
                    {
                        status:
                            newStatus
                    }
                );


            setComplaints(
                previous =>
                    previous.map(
                        complaint =>
                            complaint.id ===
                            complaintId

                                ? response.data

                                : complaint
                    )
            );


            if (
                newStatus ===
                "IN_PROGRESS"
            ) {

                showToast(
                    "success",
                    `Work started on complaint #${complaintId}.`
                );

            } else if (
                newStatus ===
                "RESOLVED"
            ) {

                showToast(
                    "success",
                    `Complaint #${complaintId} has been resolved successfully.`
                );
            }


        } catch (err) {

            console.error(err);


            showToast(
                "error",

                err.response?.data?.message ||
                "Unable to update complaint status."
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
       FORMAT STATUS
       ========================================================= */

    const formatStatus = status => {

        if (!status) {
            return "";
        }


        return status
            .replaceAll(
                "_",
                " "
            )
            .toLowerCase()
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );
    };


    /* =========================================================
       FORMAT DATE
       ========================================================= */

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


    /* =========================================================
       STATUS ICON
       ========================================================= */

    const getStatusIcon = status => {

        if (
            status === "RESOLVED" ||
            status === "CLOSED"
        ) {

            return (
                <CheckCircle2
                    size={14}
                />
            );
        }


        if (
            status ===
            "IN_PROGRESS"
        ) {

            return (
                <Clock3
                    size={14}
                />
            );
        }


        return (
            <ClipboardCheck
                size={14}
            />
        );
    };


    /* =========================================================
       ACTION TEXT
       ========================================================= */

    const getActionInfo =
        complaint => {

            if (
                complaint.status ===
                "ASSIGNED"
            ) {

                return {

                    title:
                        "Ready to start",

                    description:
                        "Begin work when you reach the issue location.",

                    button:
                        "Start this task",

                    nextStatus:
                        "IN_PROGRESS",

                    icon:
                        <Wrench
                            size={17}
                        />

                };
            }


            if (
                complaint.status ===
                "IN_PROGRESS"
            ) {

                return {

                    title:
                        "Work in progress",

                    description:
                        "Mark the task resolved after completing the work.",

                    button:
                        "Mark as resolved",

                    nextStatus:
                        "RESOLVED",

                    icon:
                        <CheckCircle2
                            size={17}
                        />

                };
            }


            return {

                title:
                    "Completed",

                description:
                    "This task has already been resolved.",

                button:
                    null,

                nextStatus:
                    null,

                icon:
                    <CheckCircle2
                        size={17}
                    />

            };
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

                    type={
                        toast.type
                    }

                    message={
                        toast.message
                    }

                    onClose={() =>
                        setToast(null)
                    }

                />

            )}


            {/* =================================================
                SIDEBAR
                ================================================= */}

            <aside className="premium-sidebar">


                {/* LOGO */}

                <div className="premium-logo-wrap">

                    <div className="premium-logo">
                        F
                    </div>


                    <div>

                        <h2>
                            FixFlow
                        </h2>

                        <p>
                            Field workspace
                        </p>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="premium-nav">


                    <button
                        className={
                            filter === "ALL"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setFilter("ALL")
                        }
                    >

                        <ClipboardCheck
                            size={18}
                        />

                        My tasks

                    </button>


                    <button
                        className={
                            filter === "ASSIGNED"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setFilter(
                                "ASSIGNED"
                            )
                        }
                    >

                        <Wrench
                            size={18}
                        />

                        Ready to start

                    </button>


                    <button
                        className={
                            filter ===
                            "IN_PROGRESS"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setFilter(
                                "IN_PROGRESS"
                            )
                        }
                    >

                        <Clock3
                            size={18}
                        />

                        In progress

                    </button>


                    <button
                        className={
                            filter ===
                            "RESOLVED"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setFilter(
                                "RESOLVED"
                            )
                        }
                    >

                        <CheckCircle2
                            size={18}
                        />

                        Completed

                    </button>

                </nav>


                {/* PROFILE */}

                <div className="premium-sidebar-footer">


                    <div className="premium-profile">


                        <div className="premium-avatar">

                            {staffName
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div className="premium-profile-text">

                            <strong>
                                {staffName}
                            </strong>

                            <span>
                                {staffEmail}
                            </span>

                        </div>

                    </div>


                    <button
                        className="premium-logout"
                        onClick={logout}
                    >

                        <LogOut
                            size={17}
                        />

                        Sign out

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
                ================================================= */}

            <main className="premium-main">


                {/* =================================================
                    TOP BAR
                    ================================================= */}

                <div className="premium-topbar">


                    <div>


                        <p className="premium-kicker">

                            <Sparkles
                                size={15}
                            />

                            Field operations

                        </p>


                        <h1>

                            Welcome back,{" "}
                            {staffName}

                        </h1>


                        <p className="premium-subtitle">

                            Review your assigned
                            complaints, start field work
                            and update tasks as they are
                            completed.

                        </p>

                    </div>


                    <button
                        className="premium-ghost-button"
                        onClick={() =>
                            fetchComplaints(
                                true
                            )
                        }
                    >

                        <RefreshCw
                            size={17}
                        />

                        Sync tasks

                    </button>

                </div>


                {/* =================================================
                    SUMMARY
                    ================================================= */}

                <section className="premium-summary-grid">


                    {/* TOTAL */}

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setFilter(
                                "ALL"
                            )
                        }
                    >

                        <span>
                            Assigned tasks
                        </span>

                        <strong>
                            {stats.total}
                        </strong>

                        <p>
                            All work assigned to you
                        </p>

                    </button>


                    {/* READY */}

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setFilter(
                                "ASSIGNED"
                            )
                        }
                    >

                        <span>
                            Ready to start
                        </span>

                        <strong>
                            {stats.assigned}
                        </strong>

                        <p>
                            Waiting for field action
                        </p>

                    </button>


                    {/* ACTIVE */}

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setFilter(
                                "IN_PROGRESS"
                            )
                        }
                    >

                        <span>
                            In progress
                        </span>

                        <strong>
                            {stats.inProgress}
                        </strong>

                        <p>
                            Work currently underway
                        </p>

                    </button>


                    {/* COMPLETED */}

                    <button
                        className="premium-summary-card"
                        onClick={() =>
                            setFilter(
                                "RESOLVED"
                            )
                        }
                    >

                        <span>
                            Completed
                        </span>

                        <strong>
                            {stats.resolved}
                        </strong>

                        <p>
                            Successfully resolved
                        </p>

                    </button>

                </section>


                {/* =================================================
                    WORK QUEUE
                    ================================================= */}

                <section className="staff-premium-panel">


                    {/* HEADER */}

                    <div className="premium-section-head">


                        <div>

                            <h2>
                                Your work queue
                            </h2>

                            <p>

                                {
                                    filteredComplaints.length
                                }

                                {" "}

                                task

                                {
                                    filteredComplaints.length !== 1
                                        ? "s"
                                        : ""
                                }

                            </p>

                        </div>


                        <div className="staff-filter-tools">


                            {/* SEARCH */}

                            <div className="premium-search">

                                <Search
                                    size={17}
                                />

                                <input

                                    type="text"

                                    placeholder="Search your tasks..."

                                    value={
                                        search
                                    }

                                    onChange={
                                        event =>
                                            setSearch(
                                                event.target.value
                                            )
                                    }

                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PREMIUM SKELETON LOADING
                        ================================================= */}

                    {loading && (

                        <StaffSkeleton
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
                        EMPTY STATE
                        ================================================= */}

                    {!loading &&
                        !error &&
                        filteredComplaints.length ===
                        0 && (

                        <div className="premium-empty">


                            <div className="premium-empty-icon">

                                <ClipboardCheck
                                    size={26}
                                />

                            </div>


                            <h3>
                                No tasks found
                            </h3>


                            <p>

                                You currently have no
                                tasks matching this view.

                            </p>

                        </div>

                    )}


                    {/* =================================================
                        TASK LIST
                        ================================================= */}

                    {!loading &&
                        !error &&
                        filteredComplaints.length >
                        0 && (

                        <div className="staff-task-list">


                            {
                                filteredComplaints.map(
                                    complaint => {

                                        const action =
                                            getActionInfo(
                                                complaint
                                            );


                                        return (

                                            <article
                                                className="staff-task-card"
                                                key={
                                                    complaint.id
                                                }
                                            >


                                                {/* =================================
                                                    TASK INFORMATION
                                                    ================================= */}

                                                <div className="staff-task-main">


                                                    <div className="premium-row-top">


                                                        <span className="premium-issue-id">

                                                            TASK #

                                                            {
                                                                complaint.id
                                                            }

                                                        </span>


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


                                                    <h3>

                                                        {
                                                            complaint.title
                                                        }

                                                    </h3>


                                                    <p className="premium-description">

                                                        {
                                                            complaint.description
                                                        }

                                                    </p>


                                                    {/* META */}

                                                    <div className="premium-meta-row">


                                                        <span>

                                                            {
                                                                complaint.category
                                                            }

                                                        </span>


                                                        <span>

                                                            <MapPin
                                                                size={13}
                                                            />

                                                            {
                                                                complaint.location
                                                            }

                                                        </span>


                                                        {complaint.residentName && (

                                                            <span>

                                                                <UserRound
                                                                    size={13}
                                                                />

                                                                {
                                                                    complaint.residentName
                                                                }

                                                            </span>

                                                        )}


                                                        <span>

                                                            {
                                                                formatDate(
                                                                    complaint.createdAt
                                                                )
                                                            }

                                                        </span>

                                                    </div>


                                                    {/* PRIORITY */}

                                                    <div className="staff-task-priority">

                                                        <span>
                                                            Priority
                                                        </span>

                                                        <strong
                                                            className={
                                                                `premium-priority priority-${complaint.priority?.toLowerCase()}`
                                                            }
                                                        >

                                                            {
                                                                complaint.priority
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* =================================
                                                    ACTION AREA
                                                    ================================= */}

                                                <div className="staff-task-action">


                                                    <div className="staff-action-icon">

                                                        {
                                                            action.icon
                                                        }

                                                    </div>


                                                    <span className="staff-action-label">

                                                        Current action

                                                    </span>


                                                    <h4>

                                                        {
                                                            action.title
                                                        }

                                                    </h4>


                                                    <p>

                                                        {
                                                            action.description
                                                        }

                                                    </p>


                                                    {
                                                        action.button && (

                                                            <button
                                                                className="staff-action-button"
                                                                disabled={
                                                                    updatingId ===
                                                                    complaint.id
                                                                }
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        complaint.id,
                                                                        action.nextStatus
                                                                    )
                                                                }
                                                            >

                                                                {
                                                                    updatingId ===
                                                                    complaint.id

                                                                        ? "Updating..."

                                                                        : action.button
                                                                }

                                                            </button>

                                                        )
                                                    }


                                                    {
                                                        !action.button && (

                                                            <div className="staff-complete-state">

                                                                <CheckCircle2
                                                                    size={16}
                                                                />

                                                                Task completed

                                                            </div>

                                                        )
                                                    }

                                                </div>

                                            </article>

                                        );
                                    }
                                )
                            }

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}


export default StaffDashboard;