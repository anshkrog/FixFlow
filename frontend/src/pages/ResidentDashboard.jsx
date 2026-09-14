import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResidentSkeleton from "../components/ResidentSkeleton";
import {
    Bell,
    Check,
    CheckCircle2,
    ChevronRight,
    CircleDot,
    Clock3,
    FileText,
    LogOut,
    Plus,
    RefreshCw,
    Search,
    Sparkles
} from "lucide-react";

import api from "../services/api";


function ResidentDashboard() {

    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const [selectedComplaint, setSelectedComplaint] =
        useState(null);


    const userName =
        localStorage.getItem("userName") ||
        "Resident";

    const userEmail =
        localStorage.getItem("userEmail") ||
        "";


    const fetchComplaints = async () => {

        setLoading(true);
        setError("");

        try {

            const response =
                await api.get("/complaints/my");

            setComplaints(response.data || []);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load complaints."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchComplaints();

    }, []);


    useEffect(() => {

        if (!selectedComplaint) {

            document.body.style.overflow = "";

            return;
        }


        document.body.style.overflow = "hidden";


        const handleEscape = event => {

            if (event.key === "Escape") {

                setSelectedComplaint(null);
            }
        };


        window.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.body.style.overflow = "";

            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };

    }, [selectedComplaint]);


    const stats = useMemo(() => {

        return {

            total: complaints.length,

            open: complaints.filter(
                item =>
                    item.status === "OPEN"
            ).length,

            active: complaints.filter(
                item =>
                    item.status === "ASSIGNED" ||
                    item.status === "IN_PROGRESS"
            ).length,

            resolved: complaints.filter(
                item =>
                    item.status === "RESOLVED" ||
                    item.status === "CLOSED"
            ).length
        };

    }, [complaints]);


    const filteredComplaints = useMemo(() => {

        return complaints.filter(item => {

            const matchesFilter =
                filter === "ALL" ||

                (
                    filter === "ACTIVE" &&
                    (
                        item.status === "ASSIGNED" ||
                        item.status === "IN_PROGRESS"
                    )
                ) ||

                (
                    filter === "RESOLVED" &&
                    (
                        item.status === "RESOLVED" ||
                        item.status === "CLOSED"
                    )
                ) ||

                item.status === filter;


            const query =
                search.trim().toLowerCase();


            const matchesSearch =
                !query ||

                item.title
                    ?.toLowerCase()
                    .includes(query) ||

                item.description
                    ?.toLowerCase()
                    .includes(query) ||

                item.category
                    ?.toLowerCase()
                    .includes(query) ||

                item.location
                    ?.toLowerCase()
                    .includes(query);


            return (
                matchesFilter &&
                matchesSearch
            );
        });

    }, [
        complaints,
        filter,
        search
    ]);


    const logout = () => {

        localStorage.clear();

        navigate("/login");
    };


    const formatStatus = status => {

        return status
            ?.replaceAll("_", " ")
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


        return new Date(date)
            .toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );
    };


    const getProgress = status => {

        if (status === "OPEN") {
            return 15;
        }

        if (status === "ASSIGNED") {
            return 40;
        }

        if (status === "IN_PROGRESS") {
            return 70;
        }

        if (
            status === "RESOLVED" ||
            status === "CLOSED"
        ) {
            return 100;
        }

        return 0;
    };


    const getStatusIcon = status => {

        if (
            status === "RESOLVED" ||
            status === "CLOSED"
        ) {

            return (
                <CheckCircle2 size={15} />
            );
        }


        if (
            status === "IN_PROGRESS"
        ) {

            return (
                <Clock3 size={15} />
            );
        }


        return (
            <CircleDot size={15} />
        );
    };


    return (

        <div className="premium-shell">

            {/* SIDEBAR */}

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
                            Resident workspace
                        </p>

                    </div>

                </div>


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
                        <FileText size={18} />
                        Overview
                    </button>


                    <button
                        className="premium-nav-item"
                        onClick={() =>
                            navigate("/resident/new")
                        }
                    >
                        <Plus size={18} />
                        New complaint
                    </button>


                    <button
                        className={
                            filter === "ACTIVE"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setFilter("ACTIVE")
                        }
                    >
                        <Clock3 size={18} />
                        Active
                    </button>


                    <button
                        className={
                            filter === "RESOLVED"
                                ? "premium-nav-item active"
                                : "premium-nav-item"
                        }
                        onClick={() =>
                            setFilter("RESOLVED")
                        }
                    >
                        <CheckCircle2 size={18} />
                        Resolved
                    </button>

                </nav>


                <div className="premium-sidebar-footer">

                    <div className="premium-profile">

                        <div className="premium-avatar">

                            {userName
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div className="premium-profile-text">

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                {userEmail}
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


            {/* MAIN */}

            <main className="premium-main">

                {/* TOP */}

                <div className="premium-topbar">

                    <div>

                        <p className="premium-kicker">

                            <Sparkles size={15} />

                            Your civic workspace

                        </p>


                        <h1>
                            Good morning, {userName}
                        </h1>


                        <p className="premium-subtitle">

                            Track reported issues,
                            monitor progress and stay
                            updated from one place.

                        </p>

                    </div>


                    <div className="premium-top-actions">

                        <button
                            className="premium-icon-button"
                            aria-label="Notifications"
                        >
                            <Bell size={19} />
                        </button>


                        <button
                            className="premium-primary"
                            onClick={() =>
                                navigate("/resident/new")
                            }
                        >
                            <Plus size={18} />
                            Report issue
                        </button>

                    </div>

                </div>


                {/* STATISTICS */}

                <section className="premium-summary-grid">

                    <button
                        className={
                            `premium-summary-card ${
                                filter === "ALL"
                                    ? "summary-selected"
                                    : ""
                            }`
                        }
                        onClick={() =>
                            setFilter("ALL")
                        }
                    >

                        <span>
                            Total complaints
                        </span>

                        <strong>
                            {stats.total}
                        </strong>

                        <p>
                            All issues you’ve reported
                        </p>

                    </button>


                    <button
                        className={
                            `premium-summary-card ${
                                filter === "OPEN"
                                    ? "summary-selected"
                                    : ""
                            }`
                        }
                        onClick={() =>
                            setFilter("OPEN")
                        }
                    >

                        <span>
                            Waiting
                        </span>

                        <strong>
                            {stats.open}
                        </strong>

                        <p>
                            Not yet assigned
                        </p>

                    </button>


                    <button
                        className={
                            `premium-summary-card ${
                                filter === "ACTIVE"
                                    ? "summary-selected"
                                    : ""
                            }`
                        }
                        onClick={() =>
                            setFilter("ACTIVE")
                        }
                    >

                        <span>
                            Active
                        </span>

                        <strong>
                            {stats.active}
                        </strong>

                        <p>
                            Currently being handled
                        </p>

                    </button>


                    <button
                        className={
                            `premium-summary-card ${
                                filter === "RESOLVED"
                                    ? "summary-selected"
                                    : ""
                            }`
                        }
                        onClick={() =>
                            setFilter("RESOLVED")
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


                {/* COMPLAINTS */}

                <section className="premium-content-section">

                    <div className="premium-section-head">

                        <div>

                            <h2>
                                Recent complaints
                            </h2>

                            <p>

                                {
                                    filteredComplaints.length
                                }

                                {" "}

                                result

                                {
                                    filteredComplaints.length !== 1
                                        ? "s"
                                        : ""
                                }

                            </p>

                        </div>


                        <div className="premium-tools">

                            <div className="premium-search">

                                <Search size={17} />


                                <input
                                    type="text"
                                    placeholder="Search complaints"
                                    value={search}
                                    onChange={
                                        event =>
                                            setSearch(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>


                            <button
                                className="premium-ghost-button"
                                onClick={fetchComplaints}
                            >
                                <RefreshCw size={17} />
                                Refresh
                            </button>

                        </div>

                    </div>


                    {/* FILTERS */}

                    <div className="premium-filter-row">

                        {[
                            ["ALL", "All"],
                            ["OPEN", "Waiting"],
                            ["ACTIVE", "Active"],
                            ["RESOLVED", "Resolved"]
                        ].map(
                            ([value, label]) => (

                                <button
                                    key={value}
                                    className={
                                        filter === value
                                            ? "premium-filter active"
                                            : "premium-filter"
                                    }
                                    onClick={() =>
                                        setFilter(value)
                                    }
                                >
                                    {label}
                                </button>

                            )
                        )}

                    </div>


                    {/* LOADING */}

                    {loading && (
                        <ResidentSkeleton rows={3} />
                    )}

                    {/* ERROR */}

                    {!loading && error && (

                        <div className="premium-error">

                            {error}

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filteredComplaints.length === 0 && (

                        <div className="premium-empty">

                            <div className="premium-empty-icon">

                                <FileText size={26} />

                            </div>


                            <h3>
                                Nothing here yet
                            </h3>


                            <p>

                                Try a different filter or
                                report a new issue.

                            </p>


                            <button
                                className="premium-primary"
                                onClick={() =>
                                    navigate(
                                        "/resident/new"
                                    )
                                }
                            >
                                <Plus size={18} />
                                Report an issue
                            </button>

                        </div>

                    )}


                    {/* LIST */}

                    {!loading &&
                        !error &&
                        filteredComplaints.length > 0 && (

                        <div className="premium-complaint-list">

                            {filteredComplaints.map(
                                complaint => (

                                    <article
                                        className="premium-complaint-row"
                                        key={complaint.id}
                                    >

                                        <div className="premium-complaint-main">

                                            <div className="premium-row-top">

                                                <span className="premium-issue-id">

                                                    ISSUE #{complaint.id}

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
                                                {complaint.title}
                                            </h3>


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

                                                    {
                                                        complaint.assignedStaffName

                                                            ? `Assigned to ${complaint.assignedStaffName}`

                                                            : "Awaiting assignment"
                                                    }

                                                </span>

                                            </div>


                                            <div className="premium-progress-wrap">

                                                <div className="premium-progress-head">

                                                    <span>
                                                        Resolution progress
                                                    </span>


                                                    <span>

                                                        {
                                                            getProgress(
                                                                complaint.status
                                                            )
                                                        }%

                                                    </span>

                                                </div>


                                                <div className="premium-progress-track">

                                                    <div
                                                        className="premium-progress-fill"
                                                        style={{
                                                            width:
                                                                `${getProgress(
                                                                    complaint.status
                                                                )}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        </div>


                                        {/* SIDE */}

                                        <div className="premium-complaint-side">

                                            <div>

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


                                            <div>

                                                <span>
                                                    Reported
                                                </span>


                                                <strong>

                                                    {
                                                        formatDate(
                                                            complaint.createdAt
                                                        )
                                                    }

                                                </strong>

                                            </div>


                                            {complaint.resolvedAt && (

                                                <div>

                                                    <span>
                                                        Resolved
                                                    </span>


                                                    <strong>

                                                        {
                                                            formatDate(
                                                                complaint.resolvedAt
                                                            )
                                                        }

                                                    </strong>

                                                </div>

                                            )}


                                            <button
                                                className="premium-detail-button"
                                                onClick={() =>
                                                    setSelectedComplaint(
                                                        complaint
                                                    )
                                                }
                                            >
                                                View details
                                                <ChevronRight size={16} />
                                            </button>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>


            {/* =====================================================
                COMPLAINT DETAILS DRAWER
            ===================================================== */}

            {selectedComplaint && (

                <div
                    className="complaint-drawer-layer"
                    onMouseDown={() =>
                        setSelectedComplaint(null)
                    }
                >

                    <aside
                        className="complaint-drawer"
                        onMouseDown={
                            event =>
                                event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="drawer-header">

                            <div>

                                <span className="drawer-eyebrow">
                                    COMPLAINT DETAILS
                                </span>


                                <h2>
                                    Issue #{selectedComplaint.id}
                                </h2>

                            </div>


                            <button
                                className="drawer-close"
                                onClick={() =>
                                    setSelectedComplaint(null)
                                }
                                aria-label="Close complaint details"
                            >
                                ×
                            </button>

                        </div>


                        {/* STATUS */}

                        <div className="drawer-status-row">

                            <span
                                className={
                                    `premium-status status-${selectedComplaint.status?.toLowerCase()}`
                                }
                            >

                                {
                                    getStatusIcon(
                                        selectedComplaint.status
                                    )
                                }

                                {
                                    formatStatus(
                                        selectedComplaint.status
                                    )
                                }

                            </span>


                            <strong
                                className={
                                    `premium-priority priority-${selectedComplaint.priority?.toLowerCase()}`
                                }
                            >

                                {
                                    selectedComplaint.priority
                                }

                            </strong>

                        </div>


                        {/* TITLE */}

                        <section className="drawer-hero">

                            <h3>
                                {
                                    selectedComplaint.title
                                }
                            </h3>


                            <p>
                                {
                                    selectedComplaint.description
                                }
                            </p>

                        </section>


                        {/* TIMELINE */}

                        <section className="drawer-section">

                            <div className="drawer-section-heading">

                                <span>
                                    RESOLUTION JOURNEY
                                </span>


                                <strong>

                                    {
                                        getProgress(
                                            selectedComplaint.status
                                        )
                                    }%

                                </strong>

                            </div>


                            <div className="drawer-progress-track">

                                <div
                                    className="drawer-progress-fill"
                                    style={{
                                        width:
                                            `${getProgress(
                                                selectedComplaint.status
                                            )}%`
                                    }}
                                />

                            </div>


                            <div className="complaint-timeline">

                                <TimelineItem
                                    title="Complaint reported"
                                    description="Your complaint was successfully submitted to FixFlow."
                                    complete={true}
                                    active={
                                        selectedComplaint.status ===
                                        "OPEN"
                                    }
                                    date={
                                        formatDate(
                                            selectedComplaint.createdAt
                                        )
                                    }
                                />


                                <TimelineItem
                                    title="Staff assigned"
                                    description={
                                        selectedComplaint.assignedStaffName

                                            ? `${selectedComplaint.assignedStaffName} was assigned to this issue.`

                                            : "Waiting for an administrator to assign maintenance staff."
                                    }
                                    complete={
                                        [
                                            "ASSIGNED",
                                            "IN_PROGRESS",
                                            "RESOLVED",
                                            "CLOSED"
                                        ].includes(
                                            selectedComplaint.status
                                        )
                                    }
                                    active={
                                        selectedComplaint.status ===
                                        "ASSIGNED"
                                    }
                                    date={
                                        selectedComplaint.assignedStaffName
                                            ? "Assigned"
                                            : "Pending"
                                    }
                                />


                                <TimelineItem
                                    title="Work in progress"
                                    description="Maintenance work is underway."
                                    complete={
                                        [
                                            "IN_PROGRESS",
                                            "RESOLVED",
                                            "CLOSED"
                                        ].includes(
                                            selectedComplaint.status
                                        )
                                    }
                                    active={
                                        selectedComplaint.status ===
                                        "IN_PROGRESS"
                                    }
                                    date={
                                        [
                                            "IN_PROGRESS",
                                            "RESOLVED",
                                            "CLOSED"
                                        ].includes(
                                            selectedComplaint.status
                                        )
                                            ? "Started"
                                            : "Pending"
                                    }
                                />


                                <TimelineItem
                                    title="Issue resolved"
                                    description="Maintenance has completed this complaint."
                                    complete={
                                        [
                                            "RESOLVED",
                                            "CLOSED"
                                        ].includes(
                                            selectedComplaint.status
                                        )
                                    }
                                    active={
                                        [
                                            "RESOLVED",
                                            "CLOSED"
                                        ].includes(
                                            selectedComplaint.status
                                        )
                                    }
                                    date={
                                        selectedComplaint.resolvedAt

                                            ? formatDate(
                                                selectedComplaint.resolvedAt
                                            )

                                            : "Pending"
                                    }
                                    last
                                />

                            </div>

                        </section>


                        {/* INFO */}

                        <section className="drawer-section">

                            <span className="drawer-section-label">
                                ISSUE INFORMATION
                            </span>


                            <div className="drawer-info-grid">

                                <div>

                                    <span>
                                        Category
                                    </span>


                                    <strong>

                                        {
                                            selectedComplaint.category ||
                                            "—"
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Priority
                                    </span>


                                    <strong>

                                        {
                                            selectedComplaint.priority ||
                                            "—"
                                        }

                                    </strong>

                                </div>


                                <div className="drawer-info-wide">

                                    <span>
                                        Location
                                    </span>


                                    <strong>

                                        {
                                            selectedComplaint.location ||
                                            "—"
                                        }

                                    </strong>

                                </div>


                                <div className="drawer-info-wide">

                                    <span>
                                        Assigned staff
                                    </span>


                                    <strong>

                                        {
                                            selectedComplaint.assignedStaffName ||
                                            "Not assigned yet"
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Reported
                                    </span>


                                    <strong>

                                        {
                                            formatDate(
                                                selectedComplaint.createdAt
                                            )
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Resolved
                                    </span>


                                    <strong>

                                        {
                                            selectedComplaint.resolvedAt

                                                ? formatDate(
                                                    selectedComplaint.resolvedAt
                                                )

                                                : "Not resolved yet"
                                        }

                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* REFERENCE */}

                        <section className="drawer-reference">

                            <div>

                                <span>
                                    REFERENCE
                                </span>


                                <strong>

                                    FIX-
                                    {
                                        String(
                                            selectedComplaint.id
                                        ).padStart(
                                            4,
                                            "0"
                                        )
                                    }

                                </strong>

                            </div>


                            <FileText size={20} />

                        </section>


                        <button
                            className="drawer-done-button"
                            onClick={() =>
                                setSelectedComplaint(null)
                            }
                        >
                            Done
                        </button>

                    </aside>

                </div>

            )}

        </div>
    );
}


function TimelineItem({
    title,
    description,
    complete,
    active,
    date,
    last
}) {

    return (

        <div
            className={
                `timeline-item ${
                    complete
                        ? "timeline-complete"
                        : ""
                } ${
                    active
                        ? "timeline-active"
                        : ""
                }`
            }
        >

            <div className="timeline-rail">

                <div className="timeline-dot">

                    {complete && (
                        <Check size={12} />
                    )}

                </div>


                {!last && (
                    <div className="timeline-line" />
                )}

            </div>


            <div className="timeline-content">

                <div className="timeline-title-row">

                    <strong>
                        {title}
                    </strong>


                    <span>
                        {date}
                    </span>

                </div>


                <p>
                    {description}
                </p>

            </div>

        </div>
    );
}


export default ResidentDashboard;