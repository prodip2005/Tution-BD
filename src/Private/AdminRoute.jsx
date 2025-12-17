import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../Providers/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

    const { data, isLoading } = useQuery({
        queryKey: ["admin-check", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data.user;
        },
    });

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // ❌ not logged in
    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // ❌ not admin
    if (data?.role !== "admin") {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    // ✅ admin access
    return children;
};

export default AdminRoute;
