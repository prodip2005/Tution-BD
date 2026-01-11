import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaLayerGroup, FaMapMarkerAlt, FaShieldAlt, FaInbox, FaMoneyBillWave } from "react-icons/fa";

const ApplyTution = () => {
    const axiosSecure = useAxiosSecure();

    const { data: tuitions = [], refetch, isLoading } = useQuery({
        queryKey: ["pending-tuitions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/tuitions/admin/pending");
            return res.data || [];
        },
    });

    const handleAction = async (id, tuition_status) => {
        const confirm = await Swal.fire({
            title: "Confirm Action?",
            text: `You are about to ${tuition_status} this post.`,
            icon: tuition_status === "approved" ? "success" : "warning",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            background: 'var(--color-base-100, #020617)',
            color: 'var(--color-base-content, #fff)',
            confirmButtonColor: tuition_status === "approved" ? "var(--color-primary, #6366f1)" : "var(--color-error, #ef4444)",
            backdrop: `rgba(var(--b1),0.8)`
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(`/tuitions/admin/review/${id}`, { tuition_status });

        if (res.data.success) {
            Swal.fire({
                title: "Action Recorded",
                text: `Post has been ${tuition_status}`,
                icon: "success",
                background: 'var(--color-base-100, #020617)',
                color: 'var(--color-base-content, #fff)'
            });
            refetch();
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-primary/10 border-t-primary rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-primary/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-10 h-10 bg-primary rounded-full blur-[2px] shadow-[0_0_20px_rgba(var(--p),0.5)]"
                    />
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-primary text-xs font-black tracking-[0.6em] uppercase italic"
                    >
                        Scanning Requests
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden px-4 py-6 md:py-10 bg-transparent">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-primary/10 blur-[100px] md:blur-[150px] -z-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-secondary/5 blur-[100px] md:blur-[150px] -z-10 rounded-full animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-10 md:mb-12 text-center md:text-left">
                    <div className="p-3 md:p-4 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 rounded-2xl md:rounded-3xl text-primary shadow-2xl">
                        <FaShieldAlt className="text-2xl md:text-4xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-5xl font-black text-base-content uppercase tracking-tighter italic leading-none">
                            Review <span className="text-primary">Console</span>
                        </h2>
                        <p className="text-base-content/40 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2">
                            Pending Verification: <span className="text-primary">{tuitions.length}</span>
                        </p>
                    </div>
                </div>

                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto bg-base-100/60 dark:bg-white/2 backdrop-blur-3xl border border-base-200 dark:border-white/5 rounded-4xl shadow-2xl overflow-hidden">
                    <table className="table w-full border-separate border-spacing-y-3 px-6 pb-6">
                        <thead>
                            <tr className="text-base-content/30 border-none uppercase text-[10px] tracking-[0.3em]">
                                <th className="bg-transparent pl-8">#</th>
                                <th className="bg-transparent">Subject Details</th>
                                <th className="bg-transparent">Target Class</th>
                                <th className="bg-transparent">Location</th>
                                <th className="bg-transparent text-center">Budget</th>
                                <th className="bg-transparent text-right pr-8">Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {tuitions.map((t, i) => (
                                    <motion.tr
                                        key={t._id}
                                        layout
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-base-200/50 dark:bg-white/3 hover:bg-base-200 dark:hover:bg-white/6 transition-all group"
                                    >
                                        <td className="rounded-l-2xl pl-8 font-mono text-base-content/20 italic">{i + 1}</td>
                                        <td className="font-bold text-base-content italic tracking-wide">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 bg-primary rounded-full animate-ping"></div>
                                                {t.subject}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="flex items-center gap-2 text-base-content/40 group-hover:text-base-content/70 transition-colors">
                                                <FaLayerGroup className="text-primary/40" /> {t.class}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="flex items-center gap-2 text-base-content/40 group-hover:text-base-content/70 transition-colors">
                                                <FaMapMarkerAlt className="text-primary/40" /> {t.location}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-lg font-black text-primary uppercase italic tracking-tighter">৳{t.budget}</span>
                                        </td>
                                        <td className="rounded-r-2xl pr-8 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => handleAction(t._id, "approved")} className="p-3 bg-success/10 text-success rounded-xl border border-success/20 hover:bg-success hover:text-success-content transition-all"><FaCheck /></button>
                                                <button onClick={() => handleAction(t._id, "rejected")} className="p-3 bg-error/10 text-error rounded-xl border border-error/20 hover:bg-error hover:text-error-content transition-all"><FaTimes /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Card Layout */}
                <div className="md:hidden flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {tuitions.map((t, i) => (
                            <motion.div
                                key={t._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-base-200/50 dark:bg-white/3 border border-base-300 dark:border-white/5 rounded-3xl p-5 shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 bg-primary rounded-full"></div>
                                        <h4 className="font-black text-base-content italic uppercase tracking-wide">{t.subject}</h4>
                                    </div>
                                    <span className="text-[10px] font-mono text-base-content/20">#{i + 1}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] text-base-content/40">
                                            <FaLayerGroup className="text-primary/40" /> {t.class}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-base-content/40">
                                            <FaMapMarkerAlt className="text-primary/40" /> {t.location}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] uppercase font-black text-base-content/20 tracking-widest mb-1">Budget</p>
                                        <p className="text-xl font-black text-primary italic">৳{t.budget}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 border-t border-base-300 dark:border-white/5 pt-4">
                                    <button
                                        onClick={() => handleAction(t._id, "approved")}
                                        className="flex items-center justify-center gap-2 py-3 bg-success/10 text-success rounded-2xl font-black uppercase text-[10px] tracking-widest border border-success/10 active:scale-95 transition-transform"
                                    >
                                        <FaCheck /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(t._id, "rejected")}
                                        className="flex items-center justify-center gap-2 py-3 bg-error/10 text-error rounded-2xl font-black uppercase text-[10px] tracking-widest border border-error/10 active:scale-95 transition-transform"
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {tuitions.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="p-8 bg-base-200 dark:bg-white/5 rounded-full border border-base-300 dark:border-white/10 mb-6 font-black scale-125 opacity-20">
                            <FaInbox size={50} />
                        </div>
                        <p className="text-base-content/40 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] italic text-[10px] md:text-xs text-secondary">
                            Queue Clear: No Pending Posts
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ApplyTution;