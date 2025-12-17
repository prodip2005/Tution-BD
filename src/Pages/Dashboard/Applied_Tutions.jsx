import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";
import { Link } from "react-router";

const Applied_Tutions = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [selectedTutor, setSelectedTutor] = React.useState(null);

    const {
        data = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["applied-tuitions", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/applications/student/${user.email}`
            );
            return res.data.applications || [];
        },
    });


    // console.log(data);


    // ================= VIEW TUTOR =================
    const handleViewTutor = async (email) => {
        try {
            const res = await axiosSecure.get(`/users/${email}`);
            if (res.data.success) {
                setSelectedTutor(res.data.user);
            }
        } catch {
            Swal.fire("Error", "Tutor info not found", "error");
        }
    };

    // ================= APPROVE / REJECT =================
    const handleStatusChange = async (id, status) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text:
                status === "approved"
                    ? "You are approving this tutor"
                    : "This tutor will be rejected permanently",
            icon: status === "approved" ? "success" : "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(
            `/applications/status/${id}`,
            {
                status,
                studentEmail: user.email,
            }
        );

        if (res.data.success) {
            Swal.fire(
                "Done!",
                `Tutor ${status}`,
                "success"
            );
            refetch();
        }
    };

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This application will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(
            `/applications/student/${id}?email=${user.email}`
        );


        if (res.data.success) {
            Swal.fire("Deleted!", "Application removed", "success");
            refetch();
        }
    };

    const handleDeleteAll = async () => {
        if (data.length === 0) {
            return Swal.fire("Nothing to delete", "", "info");
        }

        const confirm = await Swal.fire({
            title: "Delete ALL applications?",
            text: "This will permanently delete all your tutor applications!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete all",
        });

        if (!confirm.isConfirmed) return;

        const ids = data.map(app => app._id);

        const res = await axiosSecure.delete(
            "/applications/student/bulk",
            {
                data: {
                    ids,
                    email: user.email,
                },
            }
        );

        if (res.data.success) {
            Swal.fire(
                "Deleted!",
                `${res.data.deletedCount} applications removed`,
                "success"
            );
            refetch();
        }
    };




    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold text-center mb-12"
            >

                🎓 Tutor Applications
            </motion.h2>
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleDeleteAll}
                    className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                    🗑 Delete All Applications
                </button>
            </div>


            {data.length === 0 ? (
                <p className="text-center text-gray-500">
                    No tutor has applied yet.
                </p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((app, i) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-linear-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-lg border border-indigo-100"
                        >
                            {/* Tuition Info */}
                            <h3 className="text-xl font-bold text-indigo-700">
                                {app.tuitionSubject}
                            </h3>

                            {/* Salary */}
                            <div className="bg-white rounded-xl p-4 my-4 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Student Demand
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    ৳ {app.studentDemand}
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    Tutor Expected
                                </p>
                                <p className="text-xl font-semibold text-indigo-600">
                                    ৳ {app.expectedSalary}
                                </p>
                            </div>

                            {/* Tutor Info */}
                            <p className="font-semibold">
                                👨‍🏫 {app.tutorName}
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                {app.tutorEmail}
                            </p>

                            <button
                                onClick={() =>
                                    handleViewTutor(app.tutorEmail)
                                }
                                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 mb-3"
                            >
                                View Tutor Details
                            </button>

                            {/* STATUS ACTIONS */}
                            {app.status === "pending" && app.paymentStatus === "paid" && (
                                <div className="mt-3 py-2 text-center rounded-xl bg-green-100 text-green-700 font-semibold">
                                    Approved
                                </div>
                            )}

                            {/* PENDING + NOT PAID → LINK TO PAYMENT */}
                            {app.status === "pending" && app.paymentStatus !== "paid" && (


                                <div className="flex gap-3">
                                    <Link
                                        to={`/dashboard/payment/${app._id}`}
                                        className="flex-1 py-2 text-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        Approve
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleStatusChange(app._id, "rejected")
                                        }
                                        className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {app.status === "approved" && (
                                <div className="mt-3 py-2 text-center rounded-xl bg-green-100 text-green-700 font-semibold">
                                    Approved
                                </div>
                            )}

                            {app.status === "rejected" && (
                                <div className="mt-3 py-2 text-center rounded-xl bg-red-100 text-red-700 font-semibold">
                                    Rejected
                                </div>
                            )}

                            <button
                                onClick={() => handleDelete(app._id)}
                                className="mt-3 w-full py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                            >
                                🗑 Delete Application
                            </button>

                        </motion.div>
                    ))}
                </div>
            )}

            {/* ================= TUTOR MODAL ================= */}
            {selectedTutor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-2xl font-bold mb-4 text-indigo-700">
                            👨‍🏫 Tutor Profile
                        </h3>

                        <p><b>Name:</b> {selectedTutor.name}</p>
                        <p><b>Email:</b> {selectedTutor.email}</p>
                        <p><b>Subjects:</b> {selectedTutor.subjects}</p>
                        <p><b>Institution:</b> {selectedTutor.institution}</p>
                        <p><b>Location:</b> {selectedTutor.location}</p>

                        <button
                            onClick={() => setSelectedTutor(null)}
                            className="mt-6 w-full py-2 bg-gray-200 rounded-xl"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Applied_Tutions;