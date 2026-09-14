import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    ShieldCheck,
    Sparkles,
    UserRound
} from "lucide-react";

import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [touched, setTouched] =
        useState({});


    const handleChange = event => {

        const { name, value } =
            event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };


    const handleBlur = event => {

        setTouched(previous => ({
            ...previous,
            [event.target.name]: true
        }));
    };


    const validations = useMemo(() => {

        return {

            name:
                formData.name.trim().length >= 3,

            email:
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(formData.email),

            phone:
                formData.phone.trim().length >= 10,

            length:
                formData.password.length >= 8,

            uppercase:
                /[A-Z]/.test(formData.password),

            number:
                /\d/.test(formData.password)

        };

    }, [formData]);


    const passwordScore =
        [
            validations.length,
            validations.uppercase,
            validations.number
        ].filter(Boolean).length;


    const passwordLabel =
        passwordScore === 0
            ? "Very weak"
            : passwordScore === 1
                ? "Weak"
                : passwordScore === 2
                    ? "Good"
                    : "Strong";


    const canSubmit =
        validations.name &&
        validations.email &&
        validations.phone &&
        validations.length &&
        validations.uppercase &&
        validations.number;


    const handleSubmit = async event => {

        event.preventDefault();

        setTouched({
            name: true,
            email: true,
            phone: true,
            password: true
        });

        if (!canSubmit) {
            return;
        }

        setLoading(true);
        setError("");

        try {

            await api.post(
                "/auth/register",
                {
                    name:
                        formData.name.trim(),

                    email:
                        formData.email.trim(),

                    phone:
                        formData.phone.trim(),

                    password:
                        formData.password,

                    role:
                        "RESIDENT"
                }
            );

            setSuccess(true);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create your account."
            );

        } finally {

            setLoading(false);
        }
    };


    if (success) {

        return (

            <div className="register-success-page">

                <div className="register-success-glow" />

                <div className="register-success-card">

                    <div className="register-success-check">
                        <CheckCircle2 size={34} />
                    </div>

                    <span className="register-eyebrow">
                        ACCOUNT CREATED
                    </span>

                    <h1>
                        You’re ready to use FixFlow.
                    </h1>

                    <p>
                        Your resident account has been
                        created successfully. You can
                        now report issues, track their
                        progress and stay updated until
                        resolution.
                    </p>

                    <div className="register-success-summary">

                        <div>
                            <span>Account</span>
                            <strong>
                                Resident
                            </strong>
                        </div>

                        <div>
                            <span>Name</span>
                            <strong>
                                {formData.name}
                            </strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>
                                {formData.email}
                            </strong>
                        </div>

                    </div>

                    <button
                        className="register-main-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Continue to sign in
                        <ArrowRight size={17} />
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="register-page">

            <section className="register-showcase">

                <div className="register-showcase-top">

                    <div className="register-brand-mark">
                        F
                    </div>

                    <div>
                        <strong>
                            FixFlow
                        </strong>

                        <span>
                            Resident onboarding
                        </span>
                    </div>

                </div>


                <div className="register-showcase-content">

                    <p className="register-eyebrow">
                        <Sparkles size={14} />
                        BUILT FOR BETTER COMMUNITIES
                    </p>

                    <h1>
                        Turn everyday
                        problems into
                        visible progress.
                    </h1>

                    <p className="register-showcase-copy">
                        Create one account to report
                        local problems, follow their
                        journey and see when action
                        has been completed.
                    </p>


                    <div className="register-feature-stack">

                        <div className="register-feature">

                            <div>
                                <ShieldCheck size={18} />
                            </div>

                            <span>
                                <strong>
                                    Secure resident access
                                </strong>

                                <small>
                                    Role-based authentication
                                    keeps every workspace protected.
                                </small>
                            </span>

                        </div>


                        <div className="register-feature">

                            <div>
                                <ArrowRight size={18} />
                            </div>

                            <span>
                                <strong>
                                    Track every stage
                                </strong>

                                <small>
                                    From submission to assignment
                                    and final resolution.
                                </small>
                            </span>

                        </div>


                        <div className="register-feature">

                            <div>
                                <CheckCircle2 size={18} />
                            </div>

                            <span>
                                <strong>
                                    Know when it’s resolved
                                </strong>

                                <small>
                                    Stay informed without needing
                                    to chase updates manually.
                                </small>
                            </span>

                        </div>

                    </div>

                </div>


                <div className="register-showcase-footer">

                    <span>
                        FixFlow
                    </span>

                    <span>
                        Civic complaint management
                    </span>

                </div>

            </section>


            <section className="register-form-panel">

                <div className="register-form-container">

                    <Link
                        to="/login"
                        className="register-back-link"
                    >
                        <ArrowLeft size={15} />
                        Back to sign in
                    </Link>


                    <div className="register-step-row">

                        <span className="register-step active">
                            1
                        </span>

                        <div />

                        <span className="register-step">
                            2
                        </span>

                        <div />

                        <span className="register-step">
                            3
                        </span>

                    </div>


                    <div className="register-heading">

                        <p className="register-eyebrow">
                            CREATE YOUR ACCOUNT
                        </p>

                        <h2>
                            Welcome to FixFlow.
                        </h2>

                        <p>
                            Create your resident
                            profile to start reporting
                            and tracking issues.
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="register-field">

                            <label htmlFor="name">
                                Full name
                            </label>

                            <div
                                className={
                                    touched.name &&
                                    !validations.name
                                        ? "register-input invalid"
                                        : "register-input"
                                }
                            >

                                <UserRound size={17} />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Ansh Kumar"
                                    value={
                                        formData.name
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />

                                {validations.name && (
                                    <Check
                                        size={15}
                                        className="register-valid-icon"
                                    />
                                )}

                            </div>

                            {touched.name &&
                                !validations.name && (

                                <small className="register-error-text">
                                    Enter at least 3 characters.
                                </small>
                            )}

                        </div>


                        <div className="register-field">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div
                                className={
                                    touched.email &&
                                    !validations.email
                                        ? "register-input invalid"
                                        : "register-input"
                                }
                            >

                                <Mail size={17} />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={
                                        formData.email
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />

                                {validations.email && (
                                    <Check
                                        size={15}
                                        className="register-valid-icon"
                                    />
                                )}

                            </div>

                            {touched.email &&
                                !validations.email && (

                                <small className="register-error-text">
                                    Enter a valid email address.
                                </small>
                            )}

                        </div>


                        <div className="register-field">

                            <label htmlFor="phone">
                                Phone number
                            </label>

                            <div
                                className={
                                    touched.phone &&
                                    !validations.phone
                                        ? "register-input invalid"
                                        : "register-input"
                                }
                            >

                                <Phone size={17} />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="10-digit phone number"
                                    value={
                                        formData.phone
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />

                                {validations.phone && (
                                    <Check
                                        size={15}
                                        className="register-valid-icon"
                                    />
                                )}

                            </div>

                            {touched.phone &&
                                !validations.phone && (

                                <small className="register-error-text">
                                    Enter a valid phone number.
                                </small>
                            )}

                        </div>


                        <div className="register-field">

                            <div className="register-label-row">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <span>
                                    {passwordLabel}
                                </span>

                            </div>


                            <div
                                className={
                                    touched.password &&
                                    passwordScore < 3
                                        ? "register-input invalid"
                                        : "register-input"
                                }
                            >

                                <LockKeyhole size={17} />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a secure password"
                                    value={
                                        formData.password
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />


                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            previous =>
                                                !previous
                                        )
                                    }
                                >

                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}

                                </button>

                            </div>


                            <div className="register-strength-bar">

                                <span
                                    className={
                                        passwordScore >= 1
                                            ? "filled"
                                            : ""
                                    }
                                />

                                <span
                                    className={
                                        passwordScore >= 2
                                            ? "filled"
                                            : ""
                                    }
                                />

                                <span
                                    className={
                                        passwordScore >= 3
                                            ? "filled"
                                            : ""
                                    }
                                />

                            </div>


                            <div className="register-password-rules">

                                <span
                                    className={
                                        validations.length
                                            ? "valid"
                                            : ""
                                    }
                                >
                                    <Check size={12} />
                                    8+ characters
                                </span>

                                <span
                                    className={
                                        validations.uppercase
                                            ? "valid"
                                            : ""
                                    }
                                >
                                    <Check size={12} />
                                    Uppercase letter
                                </span>

                                <span
                                    className={
                                        validations.number
                                            ? "valid"
                                            : ""
                                    }
                                >
                                    <Check size={12} />
                                    Number
                                </span>

                            </div>

                        </div>


                        {error && (

                            <div className="register-form-error">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="register-main-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating your account..."
                                : "Create resident account"}

                            {!loading && (
                                <ArrowRight size={17} />
                            )}

                        </button>

                    </form>


                    <div className="register-login-link">

                        Already registered?

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Register;