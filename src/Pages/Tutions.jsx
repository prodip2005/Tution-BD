import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Providers/AuthContext";
import useRole from "../Hooks/useRole";

const Tutions = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { role, isLoading } = useRole();

    const [tab, setTab] = useState("all");
    const [applyTuition, setApplyTuition] = useState(null);
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

    // ================= MY TUITIONS (STUDENT) =================
    const {
        data: myTuitions = [],
        isLoading: loadingMy,
        refetch: refetchMy,
    } = useQuery({
        queryKey: ["my-tuitions", user?.email],
        enabled: role === "student",
        queryFn: async () => {
            const res = await axiosSecure.get(`/tuitions?email=${user.email}`);
            return res.data || [];
        },
    });

    // ================= MY APPLICATIONS (TUTOR) =================
    const {
        data: myApplications = [],
        refetch: refetchApplications,
    } = useQuery({
        queryKey: ["my-applications", user?.email],
        enabled: role === "tutor",
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/applications?email=${user.email}`
            );
            return res.data || [];
        },
    });

    // 🔥 BOOKED tuition hide
    const filteredAll = allTuitions.filter(t => t.status !== "booked");
    const filteredMy = myTuitions.filter(t => t.status !== "booked");

    const tuitions = tab === "all" ? filteredAll : filteredMy;
    const loading = tab === "all" ? loadingAll : loadingMy;

    // ================= CHECK IF ALREADY APPLIED =================
    const isApplied = (tuitionId) => {
        return myApplications.some((app) => app.tuitionId === tuitionId);
    };

    // ================= APPLY SUBMIT =================
    const handleApplySubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const applicationData = {
            tuitionId: applyTuition._id,
            tuitionSubject: applyTuition.subject,
            studentName: applyTuition.studentName,
            studentEmail: applyTuition.email,
            tutorName: user.displayName,
            tutorEmail: user.email,
            qualifications: form.qualifications.value,
            experience: form.experience.value,
            expectedSalary: form.expectedSalary.value,
        };

        const res = await axiosSecure.post("/applications", applicationData);

        if (res.data.success) {
            Swal.fire("Success", "Applied successfully", "success");
            refetchApplications();
            setApplyTuition(null);
        }
    };

    // ================= DELETE TUITION =================
    const handleDeleteTuition = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(
            `/tuitions/${id}?email=${user.email}`
        );

        if (res.data.success) {
            Swal.fire("Deleted", "", "success");
            refetchAll();
            refetchMy();
        }
    };

    // ================= EDIT SUBMIT =================
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedData = {
            subject: form.subject.value,
            class: form.class.value,
            location: form.location.value,
            budget: form.budget.value,
            email: user.email,
        };

        const res = await axiosSecure.put(
            `/tuitions/${editTuition._id}`,
            updatedData
        );

        if (res.data.success) {
            Swal.fire("Updated!", "", "success");
            setEditTuition(null);
            refetchAll();
            refetchMy();
        }
    };

    if (isLoading) return <p className="text-center">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6 text-center"
            >
                📚 Tuition Posts
            </motion.h2>

            {/* TABS */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => setTab("all")}
                    className={`px-5 py-2 rounded-full ${tab === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"}`}
                >
                    All Tuitions
                </button>

                {role === "student" && (
                    <button
                        onClick={() => setTab("my")}
                        className={`px-5 py-2 rounded-full ${tab === "my"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"}`}
                    >
                        My Tuitions
                    </button>
                )}
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                <table className="table w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Location</th>
                            <th>Budget</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tuitions.map((t, i) => (
                            <tr key={t._id}>
                                <td>{i + 1}</td>
                                <td>{t.subject}</td>
                                <td>{t.class}</td>
                                <td>{t.location}</td>
                                <td>৳ {t.budget}</td>
                                <td>
                                    {role === "student" && t.email === user?.email && (
                                        <>
                                            <button
                                                className="btn btn-xs btn-warning mr-2"
                                                onClick={() => setEditTuition(t)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={() => handleDeleteTuition(t._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}

                                    {role === "tutor" &&
                                        (isApplied(t._id) ? (
                                            <button disabled className="btn btn-xs">
                                                Applied
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-xs btn-primary"
                                                onClick={() => setApplyTuition(t)}
                                            >
                                                Apply
                                            </button>
                                        ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* APPLY MODAL */}
            {applyTuition && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <form onSubmit={handleApplySubmit} className="space-y-3">
                            <input name="qualifications" required className="input w-full" placeholder="Qualifications" />
                            <input name="experience" required className="input w-full" placeholder="Experience" />
                            <input name="expectedSalary" required className="input w-full" placeholder="Expected Salary" />
                            <button className="btn btn-primary w-full">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editTuition && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <input name="subject" defaultValue={editTuition.subject} className="input w-full" />
                            <input name="class" defaultValue={editTuition.class} className="input w-full" />
                            <input name="location" defaultValue={editTuition.location} className="input w-full" />
                            <input name="budget" defaultValue={editTuition.budget} className="input w-full" />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditTuition(null)} className="btn btn-sm">
                                    Cancel
                                </button>
                                <button className="btn btn-sm btn-primary">
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
