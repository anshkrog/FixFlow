import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Droplets,
    FileText,
    Lightbulb,
    MapPin,
    PlusCircle,
    Route,
    Sparkles,
    Trash2,
    Trees,
    Zap
} from "lucide-react";

import api from "../services/api";
import "./NewComplaint.css";


const categories = [
    {
        value: "Water",
        label: "Water",
        description: "Leaks, supply, drainage",
        icon: Droplets
    },
    {
        value: "Electricity",
        label: "Electricity",
        description: "Power or wiring issues",
        icon: Zap
    },
    {
        value: "Road",
        label: "Road",
        description: "Potholes or road damage",
        icon: Route
    },
    {
        value: "Sanitation",
        label: "Sanitation",
        description: "Waste or cleanliness",
        icon: Trash2
    },
    {
        value: "Street Light",
        label: "Street Light",
        description: "Broken street lighting",
        icon: Lightbulb
    },
    {
        value: "Public Space",
        label: "Public Space",
        description: "Parks and shared areas",
        icon: Trees
    }
];


function NewComplaint() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: ""
    });

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successComplaint, setSuccessComplaint] =
        useState(null);

    const userName =
        localStorage.getItem("userName") ||
        "Resident";


    const canSubmit = useMemo(() => {

        return (
            formData.title.trim().length >= 5 &&
            formData.description.trim().length >= 10 &&
            formData.category &&
            formData.location.trim().length >= 3
        );

    }, [formData]);


    const updateField = (field, value) => {

        setFormData(previous => ({
            ...previous,
            [field]: value
        }));

        setError("");
    };


    const handleSubmit = async event => {

        event.preventDefault();

        if (!canSubmit) {

            setError(
                "Please complete all required complaint details."
            );

            return;
        }

        try {

            setSubmitting(true);
            setError("");

            const response =
                await api.post(
                    "/complaints",
                    {
                        title:
                            formData.title.trim(),

                        description:
                            formData.description.trim(),

                        category:
                            formData.category,

                        location:
                            formData.location.trim()
                    }
                );

            setSuccessComplaint(
                response.data
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to submit complaint. Please try again."
            );

        } finally {

            setSubmitting(false);
        }
    };


    if (successComplaint) {

        return (

            <div className="report-page">

                <div className="report-success-shell">

                    <div className="report-success-card">

                        <div className="report-success-icon">
                            <CheckCircle2 size={36} />
                        </div>

                        <span className="report-eyebrow">
                            COMPLAINT SUBMITTED
                        </span>

                        <h1>
                            Your issue is now in FixFlow.
                        </h1>

                        <p>
                            Complaint #{successComplaint.id} has been
                            successfully reported. The operations team
                            can now review, prioritize and assign it.
                        </p>

                        <div className="report-success-details">

                            <div>
                                <span>Issue</span>
                                <strong>
                                    {successComplaint.title ||
                                        formData.title}
                                </strong>
                            </div>

                            <div>
                                <span>Category</span>
                                <strong>
                                    {successComplaint.category ||
                                        formData.category}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {successComplaint.status ||
                                        "OPEN"}
                                </strong>
                            </div>

                            <div>
                                <span>Location</span>
                                <strong>
                                    {successComplaint.location ||
                                        formData.location}
                                </strong>
                            </div>

                        </div>

                        <div className="report-success-actions">

                            <button
                                className="report-secondary-button"
                                onClick={() =>
                                    navigate("/resident")
                                }
                            >
                                Back to dashboard
                            </button>

                            <button
                                className="report-primary-button"
                                onClick={() => {

                                    setSuccessComplaint(null);

                                    setFormData({
                                        title: "",
                                        description: "",
                                        category: "",
                                        location: ""
                                    });
                                }}
                            >
                                <PlusCircle size={17} />
                                Report another issue
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    return (

        <div className="report-page">

            <div className="report-layout">


                {/* LEFT PANEL */}

                <aside className="report-sidebar">

                    <button
                        className="report-back-button"
                        onClick={() =>
                            navigate("/resident")
                        }
                    >
                        <ArrowLeft size={17} />
                        Dashboard
                    </button>


                    <div className="report-brand">

                        <div className="report-brand-mark">
                            F
                        </div>

                        <div>
                            <strong>FixFlow</strong>
                            <span>Resident reporting</span>
                        </div>

                    </div>


                    <div className="report-intro">

                        <p className="report-kicker">
                            <Sparkles size={14} />
                            SMART ISSUE REPORTING
                        </p>

                        <h1>
                            Tell us what needs attention.
                        </h1>

                        <p className="report-intro-description">
                            Give the operations team enough detail
                            to understand the issue and send the
                            right staff to the right place.
                        </p>

                    </div>


                    <div className="report-guide">

                        <div className="report-guide-item">

                            <div className="report-guide-number">
                                01
                            </div>

                            <div>
                                <strong>
                                    Choose a category
                                </strong>

                                <span>
                                    Help us route your issue correctly.
                                </span>
                            </div>

                        </div>


                        <div className="report-guide-item">

                            <div className="report-guide-number">
                                02
                            </div>

                            <div>
                                <strong>
                                    Describe the problem
                                </strong>

                                <span>
                                    Mention what happened and
                                    what needs fixing.
                                </span>
                            </div>

                        </div>


                        <div className="report-guide-item">

                            <div className="report-guide-number">
                                03
                            </div>

                            <div>
                                <strong>
                                    Add the location
                                </strong>

                                <span>
                                    Be specific enough for staff
                                    to find it.
                                </span>
                            </div>

                        </div>

                    </div>


                    <div className="report-user-card">

                        <div className="report-user-avatar">

                            {userName
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>
                            <span>
                                Reporting as
                            </span>

                            <strong>
                                {userName}
                            </strong>
                        </div>

                    </div>

                </aside>


                {/* FORM */}

                <main className="report-main">

                    <div className="report-form-heading">

                        <span className="report-eyebrow">
                            CREATE A COMPLAINT
                        </span>

                        <h2>
                            Report a civic issue.
                        </h2>

                        <p>
                            Complete the details below.
                            Your complaint will appear
                            instantly in your resident dashboard
                            after submission.
                        </p>

                    </div>


                    <form
                        className="report-form"
                        onSubmit={handleSubmit}
                    >


                        {/* CATEGORY */}

                        <section className="report-form-section">

                            <div className="report-section-title">

                                <div className="report-section-icon">
                                    <Building2 size={17} />
                                </div>

                                <div>

                                    <h3>
                                        What kind of issue is it?
                                    </h3>

                                    <p>
                                        Select the closest category.
                                    </p>

                                </div>

                            </div>


                            <div className="report-category-grid">

                                {categories.map(category => {

                                    const Icon =
                                        category.icon;

                                    const selected =
                                        formData.category ===
                                        category.value;

                                    return (

                                        <button
                                            key={category.value}
                                            type="button"
                                            className={
                                                selected
                                                    ? "report-category-card selected"
                                                    : "report-category-card"
                                            }
                                            onClick={() =>
                                                updateField(
                                                    "category",
                                                    category.value
                                                )
                                            }
                                        >

                                            <div className="report-category-icon">
                                                <Icon size={20} />
                                            </div>

                                            <div className="report-category-text">

                                                <strong>
                                                    {category.label}
                                                </strong>

                                                <span>
                                                    {category.description}
                                                </span>

                                            </div>

                                            <div className="report-category-check">

                                                {selected && (
                                                    <CheckCircle2
                                                        size={17}
                                                    />
                                                )}

                                            </div>

                                        </button>
                                    );
                                })}

                            </div>

                        </section>


                        {/* TITLE */}

                        <section className="report-form-section">

                            <div className="report-section-title">

                                <div className="report-section-icon">
                                    <FileText size={17} />
                                </div>

                                <div>

                                    <h3>
                                        Give the issue a clear title
                                    </h3>

                                    <p>
                                        Keep it short and specific.
                                    </p>

                                </div>

                            </div>


                            <label className="report-field">

                                <span>
                                    ISSUE TITLE
                                </span>

                                <input
                                    type="text"
                                    maxLength={120}
                                    placeholder="Example: Street light not working near Block B"
                                    value={formData.title}
                                    onChange={event =>
                                        updateField(
                                            "title",
                                            event.target.value
                                        )
                                    }
                                />

                                <small>
                                    {formData.title.length}/120
                                </small>

                            </label>

                        </section>


                        {/* DESCRIPTION */}

                        <section className="report-form-section">

                            <div className="report-section-title">

                                <div className="report-section-icon">
                                    <FileText size={17} />
                                </div>

                                <div>

                                    <h3>
                                        Explain what happened
                                    </h3>

                                    <p>
                                        Add useful context for
                                        the operations team.
                                    </p>

                                </div>

                            </div>


                            <label className="report-field">

                                <span>
                                    DESCRIPTION
                                </span>

                                <textarea
                                    rows={6}
                                    maxLength={1000}
                                    placeholder="Describe the issue, when you noticed it, and any useful details..."
                                    value={formData.description}
                                    onChange={event =>
                                        updateField(
                                            "description",
                                            event.target.value
                                        )
                                    }
                                />

                                <small>
                                    {formData.description.length}/1000
                                </small>

                            </label>

                        </section>


                        {/* LOCATION */}

                        <section className="report-form-section">

                            <div className="report-section-title">

                                <div className="report-section-icon">
                                    <MapPin size={17} />
                                </div>

                                <div>

                                    <h3>
                                        Where is the issue?
                                    </h3>

                                    <p>
                                        Give staff a clear
                                        location reference.
                                    </p>

                                </div>

                            </div>


                            <label className="report-field">

                                <span>
                                    LOCATION
                                </span>

                                <div className="report-location-input">

                                    <MapPin size={17} />

                                    <input
                                        type="text"
                                        maxLength={200}
                                        placeholder="Example: Near Gate 2, Block B, Main Road"
                                        value={formData.location}
                                        onChange={event =>
                                            updateField(
                                                "location",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </label>

                        </section>


                        {error && (
                            <div className="report-error">
                                {error}
                            </div>
                        )}


                        <div className="report-submit-area">

                            <div className="report-submit-note">

                                <CheckCircle2 size={16} />

                                <span>
                                    Your complaint will be created
                                    with <strong>OPEN</strong> status
                                    and reviewed by an administrator.
                                </span>

                            </div>


                            <div className="report-submit-buttons">

                                <button
                                    type="button"
                                    className="report-secondary-button"
                                    onClick={() =>
                                        navigate("/resident")
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="report-primary-button"
                                    disabled={
                                        submitting ||
                                        !canSubmit
                                    }
                                >

                                    {submitting
                                        ? "Submitting..."
                                        : (
                                            <>
                                                <PlusCircle
                                                    size={17}
                                                />
                                                Submit complaint
                                            </>
                                        )
                                    }

                                </button>

                            </div>

                        </div>

                    </form>

                </main>

            </div>

        </div>
    );
}


export default NewComplaint;