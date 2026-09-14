import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles
} from "lucide-react";

import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleChange = event => {

        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };


    const handleSubmit = async event => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response =
                await api.post(
                    "/auth/login",
                    formData
                );

            const data = response.data;


            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "role",
                data.role
            );

            localStorage.setItem(
                "userId",
                data.id
            );

            localStorage.setItem(
                "userName",
                data.name
            );

            localStorage.setItem(
                "userEmail",
                data.email
            );


            if (data.role === "RESIDENT") {

                navigate("/resident");

            } else if (data.role === "ADMIN") {

                navigate("/admin");

            } else if (data.role === "STAFF") {

                navigate("/staff");

            } else {

                setError(
                    "Your account role is not supported."
                );
            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <section className="auth-visual">

                <div className="auth-brand">

                    <div className="auth-logo">
                        F
                    </div>

                    <div>
                        <strong>FixFlow</strong>
                        <span>
                            Civic operations,
                            simplified.
                        </span>
                    </div>

                </div>


                <div className="auth-hero">

                    <p className="auth-kicker">
                        <Sparkles size={15} />
                        SMART CIVIC WORKFLOW
                    </p>

                    <h1>
                        Report.
                        <br />
                        Coordinate.
                        <br />
                        Resolve.
                    </h1>

                    <p>
                        One workspace connecting
                        residents, administrators and
                        maintenance teams from issue
                        reporting to resolution.
                    </p>


                    <div className="auth-feature-list">

                        <div>
                            <ShieldCheck size={17} />
                            Secure role-based access
                        </div>

                        <div>
                            <ArrowRight size={17} />
                            Real-time complaint workflow
                        </div>

                        <div>
                            <Sparkles size={17} />
                            Clear resolution tracking
                        </div>

                    </div>

                </div>


                <div className="auth-visual-footer">
                    FixFlow · Civic complaint management
                </div>

            </section>


            <section className="auth-form-side">

                <div className="auth-card">

                    <div className="auth-card-header">

                        <p>
                            WELCOME BACK
                        </p>

                        <h2>
                            Sign in to FixFlow
                        </h2>

                        <span>
                            Access your workspace and
                            continue where you left off.
                        </span>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="auth-field">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="auth-input-wrap">

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
                                    required
                                />

                            </div>

                        </div>


                        <div className="auth-field">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="auth-input-wrap">

                                <LockKeyhole
                                    size={17}
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={
                                        formData.password
                                    }
                                    onChange={handleChange}
                                    required
                                />


                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            previous =>
                                                !previous
                                        )
                                    }
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {error && (

                            <div className="auth-error">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign in"}

                            {!loading && (
                                <ArrowRight size={17} />
                            )}

                        </button>

                    </form>


                    <div className="auth-register-link">

                        <span>
                            New to FixFlow?
                        </span>

                        <Link to="/register">
                            Create resident account
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;