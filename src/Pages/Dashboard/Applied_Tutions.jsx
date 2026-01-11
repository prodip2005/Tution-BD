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
            Swal.fire({ title: "Error", text: "Tutor info not found", icon: "error", background: 'var(--color-base-100, #111827)', color: 'var(--color-base-content, #fff)' });
        }
    };

    const handleStatusChange = async (id, status) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: status === "approved" ? "You are approving this tutor" : "This tutor will be rejected permanently",
            icon: status === "approved" ? "success" : "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            background: 'var(--color-base-100, #111827)',
            color: 'var(--color-base-content, #fff)',
            confirmButtonColor: status === "approved" ? "var(--color-success, #22c55e)" : "var(--color-error, #ef4444)"
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(`/applications/status/${id}`, { status, studentEmail: user.email });
        if (res.data.success) {
            Swal.fire({ title: "Done!", text: `Tutor ${status}`, icon: "success", background: 'var(--color-base-100, #111827)', color: 'var(--color-base-content, #fff)' });
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
            background: 'var(--color-base-100, #111827)',
            color: 'var(--color-base-content, #fff)',
            confirmButtonColor: "var(--color-error, #ef4444)"
        });

        if (!confirm.isConfirmed) return;
        const res = await axiosSecure.delete(`/applications/student/${id}?email=${user.email}`);
        if (res.data.success) {
            Swal.fire({ title: "Deleted!", icon: "success", background: 'var(--color-base-100, #111827)', color: 'var(--color-base-content, #fff)' });
            refetch();
        }
    };

    const handleDeleteAll = async () => {
        const confirm = await Swal.fire({
            title: "Delete all?",
            text: "Permanently delete all records!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete all",
            confirmButtonColor: "var(--color-error, #ef4444)",
            background: "var(--color-base-100, #111827)",
            color: "var(--color-base-content, #fff)",
        });

        if (!confirm.isConfirmed) return;
        const ids = data.map(app => app._id);
        try {
            const res = await axiosSecure.delete("/applications/student/bulk", { data: { ids, email: user.email } });
            if (res.data.success) {
                Swal.fire({ title: "Deleted!", text: `${res.data.deletedCount} items removed`, icon: "success", background: "var(--color-base-100, #111827)", color: "var(--color-base-content, #fff)" });
                refetch();
            }
        } catch {
            Swal.fire({ title: "Error", text: "Failed to delete", icon: "error", background: "var(--color-base-100, #111827)", color: "var(--color-base-content, #fff)" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="w-24 h-24 md:w-32 md:h-32 border-2 border-primary/10 border-t-primary rounded-full" />
                    <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-primary),0.5)]" />
                </div>
                <div className="mt-8 md:mt-12 flex flex-col items-center gap-3">
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-primary text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase italic text-center">Fetching Applications</motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-6 md:py-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 px-2">
                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2 md:p-3 bg-primary/20 rounded-xl md:rounded-2xl text-primary"><FaUserGraduate size={24} className="md:w-8 md:h-8" /></div>
                        <h2 className="text-xl md:text-5xl font-black text-base-content uppercase tracking-tighter italic leading-tight">
                            Tutor <span className="text-primary">Requests</span>
                        </h2>
                    </div>
                </motion.div>

                {data.length > 0 && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteAll}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-error/10 text-error border border-error/20 font-black uppercase text-[10px] md:text-sm transition-all"
                    >
                        <FaTrash /> Delete All
                    </motion.button>
                )}
            </div>

            {data.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 flex flex-col items-center">
                    <Lottie animationData={null} path={emptyAnim} loop className="w-48 md:w-64 opacity-10 dark:opacity-20" />
                    <p className="text-base-content/40 font-bold uppercase tracking-widest mt-6 text-xs md:text-base">No tutor has applied yet.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-8">
                    <AnimatePresence>
                        {data.map((app, i) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative group bg-base-100 dark:bg-white/2 backdrop-blur-3xl border border-base-300 dark:border-white/5 p-3 md:p-6 rounded-3xl md:rounded-4xl shadow-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-base-content hidden md:block"><FaChartLine size={80} /></div>

                                <div>
                                    <h3 className="text-[11px] md:text-xl font-black text-base-content mb-2 md:mb-4 italic flex items-center gap-1.5 truncate">
                                        <span className="size-1.5 md:size-2 bg-primary rounded-full shrink-0"></span>
                                        {app.tuitionSubject}
                                    </h3>

                                    <div className="bg-base-200 dark:bg-white/3 rounded-xl md:rounded-3xl p-2 md:p-5 mb-3 md:mb-6 border border-base-300 dark:border-white/5">
                                        <div className="grid grid-cols-1 md:flex md:justify-between gap-1 md:gap-4 mb-2">
                                            <div>
                                                <p className="text-[7px] md:text-[10px] uppercase font-black text-base-content/40">Student</p>
                                                <p className="text-[10px] md:text-xl font-black text-success">৳{app.studentDemand}</p>
                                            </div>
                                            <div className="md:text-right">
                                                <p className="text-[7px] md:text-[10px] uppercase font-black text-base-content/40">Tutor</p>
                                                <p className="text-[10px] md:text-xl font-black text-primary">৳{app.expectedSalary}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
                                        <div className="size-6 md:size-12 bg-base-300 dark:bg-white/5 rounded-full flex items-center justify-center border border-base-300 dark:border-white/10 overflow-hidden shrink-0">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.tutorEmail}`} alt="tutor" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-base-content text-[9px] md:text-base truncate leading-none mb-1">{app.tutorName}</p>
                                            <p className="text-[7px] md:text-[10px] text-base-content/40 truncate">{app.tutorEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:space-y-3">
                                    <button
                                        onClick={() => handleViewTutor(app.tutorEmail)}
                                        className="w-full py-2 md:py-4 rounded-lg md:rounded-2xl bg-base-200 dark:bg-white/5 text-base-content font-bold hover:bg-base-300 dark:hover:bg-white/10 text-[9px] md:text-base flex items-center justify-center gap-1.5 transition-all border border-base-300 dark:border-none"
                                    >
                                        <FaEye /> Profile
                                    </button>

                                    {app.status === "pending" && app.paymentStatus !== "paid" && (
                                        <div className="flex flex-col md:flex-row gap-1.5 md:gap-3">
                                            <Link
                                                to={`/dashboard/payment/${app._id}`}
                                                className="w-full md:flex-1 py-2 md:py-4 text-center rounded-lg md:rounded-2xl bg-primary text-white font-black text-[9px] md:text-base flex items-center justify-center gap-1 shadow-lg shadow-primary/20"
                                            >
                                                <FaMoneyCheckAlt /> Approve
                                            </Link>
                                            <button
                                                onClick={() => handleStatusChange(app._id, "rejected")}
                                                className="w-full md:w-auto px-4 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl bg-error/10 text-error border border-error/20 flex justify-center items-center hover:bg-error/20 transition-all"
                                            >
                                                <FaTimesCircle size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Status Display */}
                                    {(app.status === "approved" || (app.status === "pending" && app.paymentStatus === "paid")) && (
                                        <div className="py-2 md:py-4 text-center rounded-lg md:rounded-2xl bg-success/10 text-success font-black flex items-center justify-center gap-1.5 uppercase text-[7px] md:text-xs border border-success/20">
                                            <FaCheckCircle /> Approved
                                        </div>
                                    )}

                                    {app.status === "rejected" && (
                                        <div className="py-2 md:py-4 text-center rounded-lg md:rounded-2xl bg-error/10 text-error font-black flex items-center justify-center gap-1.5 uppercase text-[7px] md:text-xs border border-error/20">
                                            <FaTimesCircle /> Rejected
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="w-full py-1 text-base-content/40 hover:text-error text-[7px] md:text-[10px] font-black uppercase tracking-tighter"
                                    >
                                        Remove Record
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Tutor Modal */}
            <AnimatePresence>
                {selectedTutor && (
                    <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-base-100 border border-base-300 dark:border-white/10 rounded-4xl md:rounded-[3rem] p-6 md:p-8 w-full max-w-sm md:max-w-md relative shadow-2xl">
                            <h3 className="text-xl md:text-3xl font-black text-base-content uppercase italic mb-6">Tutor <span className="text-primary">Profile</span></h3>
                            <div className="space-y-3">
                                {[
                                    { l: "Name", v: selectedTutor.name },
                                    { l: "Email", v: selectedTutor.email },
                                    { l: "Subjects", v: selectedTutor.subjects },
                                    { l: "Institution", v: selectedTutor.institution },
                                    { l: "Location", v: selectedTutor.location }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-base-200 dark:bg-white/5 p-3 rounded-xl border border-base-300 dark:border-white/5">
                                        <p className="text-[7px] md:text-[9px] uppercase font-black text-base-content/40 tracking-widest mb-1">{item.l}</p>
                                        <p className="text-base-content font-bold text-xs md:text-base">{item.v || "N/A"}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setSelectedTutor(null)} className="mt-6 w-full py-3 md:py-4 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-xs md:text-base">Close Profile</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Applied_Tutions;