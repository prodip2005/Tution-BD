import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Providers/AuthContext";
import useRole from "../Hooks/useRole";
import useDebounce from "../Hooks/useDebounce";

const Tutions = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { role, isLoading } = useRole();

    const [applyTuition, setApplyTuition] = useState(null);
    const [sortBy, setSortBy] = useState("latest");
    const [search, setSearch] = useState("");

    // 🔥 debounce search (important)
    const debouncedSearch = useDebounce(search, 500);

    // ================= ALL TUITIONS =================
    const {
        data: allTuitions = [],
        isLoading: loadingAll,
    } = useQuery({
        queryKey: ["tuitions", sortBy, debouncedSearch],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/tuitions?sortBy=${sortBy}&search=${debouncedSearch}`
            );
            return res.data || [];
        },
    });

    // ================= MY APPLICATIONS =================
    const {
        data: myApplications = [],
        refetch: refetchApplications,
    } = useQuery({
        queryKey: ["my-applications", user?.email],
        enabled: role === "tutor" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/applications?email=${user.email}`
            );
            return res.data || [];
        },
    });

    // ================= FILTER =================
    const tuitions = allTuitions.filter(
        t => t.status !== "booked" && t.tuition_status === "approved"
    );

    // ================= CHECK APPLIED =================
    const isApplied = (tuitionId) =>
        myApplications.some(app => app.tuitionId === tuitionId);

    // ================= APPLY =================
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
        } else {
            Swal.fire("Error", res.data.message || "Failed", "error");
        }
    };

    if (isLoading || loadingAll) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6 text-center"
            >
                📚 Available Tuitions
            </motion.h2>

            {/* SEARCH + SORT */}
            <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by subject, class, location"
                    className="input input-bordered input-sm w-full md:w-72"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="select select-bordered select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="latest">Latest</option>
                    <option value="location">Location (A–Z)</option>
                    <option value="class">Class</option>
                    <option value="subject">Subject (A–Z)</option>
                </select>
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
                            {role === "tutor" && <th>Action</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {tuitions.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-6">
                                    No tuitions found
                                </td>
                            </tr>
                        )}

                        {tuitions.map((t, i) => (
                            <tr key={t._id}>
                                <td>{i + 1}</td>
                                <td>{t.subject}</td>
                                <td>{t.class}</td>
                                <td>{t.location}</td>
                                <td>৳ {t.budget}</td>

                                {role === "tutor" && (
                                    <td>
                                        {isApplied(t._id) ? (
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
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* APPLY MODAL */}
            {applyTuition && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-semibold mb-3">
                            Apply for {applyTuition.subject}
                        </h3>

                        <form onSubmit={handleApplySubmit} className="space-y-3">
                            <input
                                name="qualifications"
                                required
                                className="input input-bordered w-full"
                                placeholder="Qualifications"
                            />
                            <input
                                name="experience"
                                required
                                className="input input-bordered w-full"
                                placeholder="Experience"
                            />
                            <input
                                name="expectedSalary"
                                required
                                className="input input-bordered w-full"
                                placeholder="Expected Salary"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setApplyTuition(null)}
                                    className="btn btn-sm"
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-sm btn-primary">
                                    Submit
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
