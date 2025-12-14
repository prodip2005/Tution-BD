import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Providers/AuthContext";
import useRole from "../Hooks/useRole";

const Tutions = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();

    const [tab, setTab] = useState("all");
    const [editTuition, setEditTuition] = useState(null);

    // ================= ALL TUITIONS =================
    const {
        data: allTuitions = [],
        isLoading: loadingAll,
        refetch: refetchAll,
    } = useQuery({
        queryKey: ["tuitions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/tuitions");
            return res.data || [];
        },
    });

    // ================= MY TUITIONS =================
    const {
        data: myTuitions = [],
        isLoading: loadingMy,
        refetch: refetchMy,
    } = useQuery({
        queryKey: ["my-tuitions", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/tuitions?email=${user.email}`);
            return res.data || [];
        },
    });

    const tuitions = tab === "all" ? allTuitions : myTuitions;
    const loading = tab === "all" ? loadingAll : loadingMy;

    // ================= UPDATE HANDLER =================
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedData = {
            subject: form.subject.value,
            class: form.class.value,
            location: form.location.value,
            budget: form.budget.value,
            time: form.time.value,
            details: form.details.value,
            email: user.email, // 🔐 security
        };

        const res = await axiosSecure.put(
            `/tuitions/${editTuition._id}`,
            updatedData
        );

        if (res.data.success) {
            alert("Tuition updated successfully");
            setEditTuition(null);
            refetchAll();
            refetchMy();
        }
    };


    const handleDelete = async (tuitionId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this tuition?"
        );

        if (!confirmDelete) return;

        try {
            const res = await axiosSecure.delete(
                `/tuitions/${tuitionId}?email=${user.email}`
            );

            if (res.data.success) {
                alert("Tuition deleted successfully");
                refetchAll();
                refetchMy();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete tuition");
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6 text-center"
            >
                📚 Tuition Posts
            </motion.h2>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => setTab("all")}
                    className={`px-5 py-2 rounded-full ${tab === "all"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"
                        }`}
                >
                    All Tuitions
                </button>

                {role === "student" && (
                    <button
                        onClick={() => setTab("my")}
                        className={`px-5 py-2 rounded-full ${tab === "my"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200"
                            }`}
                    >
                        My Tuitions
                    </button>
                )}
            </div>

            {/* Table */}
            <motion.div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                {loading ? (
                    <p className="text-center py-10">Loading...</p>
                ) : (
                    <table className="table w-full">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th>#</th>
                                <th>Subject</th>
                                <th>Class</th>
                                <th>Location</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Posted By</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tuitions.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-6">
                                        No tuitions found
                                    </td>
                                </tr>
                            ) : (
                                tuitions.map((t, i) => (
                                    <motion.tr
                                        key={t._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <td>{i + 1}</td>
                                        <td>{t.subject}</td>
                                        <td>{t.class}</td>
                                        <td>{t.location}</td>
                                        <td>৳ {t.budget}</td>
                                        <td>
                                            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="text-sm">{t.email}</td>
                                        <td className="space-x-2">
                                            {/* STUDENT EDIT */}
                                            {role === "student" && t.email === user?.email && (
                                                <>
                                                    <button
                                                        onClick={() => setEditTuition(t)}
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(t._id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-full text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}


                                            {/* TUTOR / ADMIN APPLY */}
                                            {(role === "tutor" ||
                                                role === "admin") && (
                                                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm">
                                                        Apply
                                                    </button>
                                                )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </motion.div>

            {/* ================= EDIT MODAL ================= */}
            {editTuition && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            ✏️ Edit Tuition
                        </h3>

                        <form onSubmit={handleUpdate} className="space-y-3">
                            <input
                                name="subject"
                                defaultValue={editTuition.subject}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="class"
                                defaultValue={editTuition.class}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="location"
                                defaultValue={editTuition.location}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="budget"
                                defaultValue={editTuition.budget}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="time"
                                defaultValue={editTuition.time}
                                className="input input-bordered w-full"
                            />
                            <textarea
                                name="details"
                                defaultValue={editTuition.details}
                                className="textarea textarea-bordered w-full"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditTuition(null)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tutions;
