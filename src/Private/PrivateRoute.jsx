// src/Routes/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Providers/AuthContext";
import ScalingBarLoader from "../components/ScalingBarLoader";


const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // Loading হলে spinner/showing skeleton দেখানো যাবে
    if (loading) {
        return <ScalingBarLoader/>
    }

    // user না থাকলে → login পেইজে redirect
    return user ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
};

export default PrivateRoute;
