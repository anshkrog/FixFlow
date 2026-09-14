import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ResidentDashboard from "./pages/ResidentDashboard";
import NewComplaint from "./pages/NewComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";


function ProtectedRoute({ allowedRole, children }) {

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");


    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (role !== allowedRole) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return children;
}


function HomeRedirect() {

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");


    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (role === "RESIDENT") {
        return (
            <Navigate
                to="/resident"
                replace
            />
        );
    }


    if (role === "ADMIN") {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }


    if (role === "STAFF") {
        return (
            <Navigate
                to="/staff"
                replace
            />
        );
    }


    return (
        <Navigate
            to="/login"
            replace
        />
    );
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* HOME */}

                <Route
                    path="/"
                    element={
                        <HomeRedirect />
                    }
                />


                {/* PUBLIC ROUTES */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* RESIDENT */}

                <Route
                    path="/resident"
                    element={
                        <ProtectedRoute
                            allowedRole="RESIDENT"
                        >
                            <ResidentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/resident/new"
                    element={
                        <ProtectedRoute
                            allowedRole="RESIDENT"
                        >
                            <NewComplaint />
                        </ProtectedRoute>
                    }
                />


                {/* ADMIN */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRole="ADMIN"
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* STAFF */}

                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute
                            allowedRole="STAFF"
                        >
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* UNKNOWN ROUTES */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;