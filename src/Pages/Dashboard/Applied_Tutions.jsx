import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";
import { Link } from "react-router";
import Lottie from "lottie-react";
import { FaUserGraduate, FaTrash, FaCheckCircle, FaTimesCircle, FaEye, FaMoneyCheckAlt, FaChartLine } from "react-icons/fa";

// Animations
const emptyAnim = "https://lottie.host/81e59267-3a13-431d-8547-49d3298c4d62/X6YxX8rS2S.json";

const Applied_Tutions = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [selectedTutor, setSelectedTutor] = React.useState(null);

    const { data = [], isLoading, refetch } = useQuery({
        queryKey: ["applied-tuitions", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/student/${user.email}`);
            return res.data.applications || [];
        },
    });

    const handleViewTutor = async (email) => {
        try {
            const res = await axiosSecure.get(`/users/${email}`);
            if (res.data.success) {
                setSelectedTutor(res.data.user);
            }
        } catch {
            Swal.fire({ title: "Error", text: "Tutor info not found", icon: "error", background: '#111827', color: '#fff' });
        }
    };

    const handleStatusChange = async (id, status) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: status === "approved" ? "You are approving this tutor" : "This tutor will be rejected permanently",
            icon: status === "approved" ? "success" : "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            background: '#111827',
            color: '#fff',
            confirmButtonColor: status === "approved" ? "#22c55e" : "#ef4444"
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(`/applications/status/${id}`, { status, studentEmail: user.email });
        if (res.data.success) {
            Swal.fire({ title: "Done!", text: `Tutor ${status}`, icon: "success", background: '#111827', color: '#fff' });
            refetch();
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete Application?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            background: '#111827',
            color: '#fff',
            confirmButtonColor: "#ef4444"
        });

        if (!confirm.isConfirmed) return;
        const res = await axiosSecure.delete(`/applications/student/${id}?email=${user.email}`);
        if (res.data.success) {
            Swal.fire({ title: "Deleted!", icon: "success", background: '#111827', color: '#fff' });
            refetch();
        }
    };


    const handleDeleteAll = async () => {
        const confirm = await Swal.fire({
            title: "Delete all applications?",
            text: "This will permanently delete all records!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete all",
            confirmButtonColor: "#ef4444",
            background: "#111827",
            color: "#fff",
        });

        if (!confirm.isConfirmed) return;

        const ids = data.map(app => app._id);

        try {
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
                Swal.fire({
                    title: "Deleted!",
                    text: `${res.data.deletedCount} applications removed`,
                    icon: "success",
                    background: "#111827",
                    color: "#fff",
                });
                refetch();
            }
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Failed to delete applications",
                icon: "error",
                background: "#111827",
                color: "#fff",
            });
        }
    };


    // --- Modern Cyber Loader ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Fetching Applications
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl text-primary"><FaUserGraduate size={32} /></div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                            Tutor <span className="text-primary">Requests</span>
                        </h2>
                    </div>
                </motion.div>

                {data.length > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteAll}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                        <FaTrash /> Delete All
                    </motion.button>
                )}
            </div>

            {data.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 flex flex-col items-center">
                    <Lottie animationData={null} path={emptyAnim} loop className="w-64 opacity-50" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest mt-6">No tutor has applied yet.</p>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {data.map((app, i) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="relative group bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-6 rounded-[2.5rem] shadow-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
                            >
                                {/* Background Accent */}
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-white group-hover:opacity-10 transition-opacity">
                                    <FaChartLine size={80} />
                                </div>

                                {/* Subject */}
                                <h3 className="text-xl font-black text-white mb-4 italic flex items-center gap-2">
                                    <span className="size-2 bg-primary rounded-full animate-ping"></span>
                                    {app.tuitionSubject}
                                </h3>

                                {/* Salary Comparison Card */}
                                <div className="bg-white/[0.03] rounded-3xl p-5 mb-6 border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Student Budget</p>
                                            <p className="text-xl font-black text-green-400">৳ {app.studentDemand}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Tutor Expected</p>
                                            <p className="text-xl font-black text-primary">৳ {app.expectedSalary}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-primary"></motion.div>
                                    </div>
                                </div>

                                {/* Tutor Identity */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="size-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.tutorEmail}`} alt="tutor" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{app.tutorName}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{app.tutorEmail}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleViewTutor(app.tutorEmail)}
                                        className="w-full py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaEye /> View Profile
                                    </button>

                                    {app.status === "pending" && app.paymentStatus !== "paid" && (
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/dashboard/payment/${app._id}`}
                                                className="flex-1 py-4 text-center rounded-2xl bg-primary text-white font-black hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaMoneyCheckAlt /> Approve
                                            </Link>
                                            <button
                                                onClick={() => handleStatusChange(app._id, "rejected")}
                                                className="px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <FaTimesCircle size={20} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Status Indicators */}
                                    {(app.status === "approved" || (app.status === "pending" && app.paymentStatus === "paid")) && (
                                        <div className="py-4 text-center rounded-2xl bg-green-500/10 text-green-400 font-black flex items-center justify-center gap-2 uppercase tracking-widest text-xs border border-green-500/20">
                                            <FaCheckCircle /> Approved
                                        </div>
                                    )}

                                    {app.status === "rejected" && (
                                        <div className="py-4 text-center rounded-2xl bg-red-500/10 text-red-500 font-black flex items-center justify-center gap-2 uppercase tracking-widest text-xs border border-red-500/20">
                                            <FaTimesCircle /> Rejected
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="w-full py-2 text-gray-600 hover:text-red-500 transition-colors text-[10px] uppercase font-black tracking-widest mt-2"
                                    >
                                        Remove Record
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* ================= TUTOR MODAL (GLASSY DARK) ================= */}
            <AnimatePresence>
                {selectedTutor && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0f1115] border border-white/10 rounded-[3rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 -z-0"><FaUserGraduate size={150} /></div>

                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-8 relative z-10">
                                Tutor <span className="text-primary">Profile</span>
                            </h3>

                            <div className="space-y-4 relative z-10">
                                {[
                                    { label: "Name", value: selectedTutor.name },
                                    { label: "Email", value: selectedTutor.email },
                                    { label: "Subjects", value: selectedTutor.subjects },
                                    { label: "Institution", value: selectedTutor.institution },
                                    { label: "Location", value: selectedTutor.location }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{item.label}</p>
                                        <p className="text-white font-bold">{item.value || "Not Provided"}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setSelectedTutor(null)}
                                className="mt-8 w-full py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                            >
                                Close Profile
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Applied_Tutions;