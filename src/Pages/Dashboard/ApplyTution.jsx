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
            background: '#020617',
            color: '#fff',
            confirmButtonColor: tuition_status === "approved" ? "#6366f1" : "#ef4444",
            backdrop: `rgba(0,0,0,0.8)`
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(`/tuitions/admin/review/${id}`, { tuition_status });

        if (res.data.success) {
            Swal.fire({
                title: "Action Recorded",
                text: `Post has been ${tuition_status}`,
                icon: "success",
                background: '#020617',
                color: '#fff'
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
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full blur-[2px]"
                    />
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-xs font-black tracking-[0.6em] uppercase italic"
                    >
                        Scanning Requests
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden px-4 py-6 md:py-10 bg-[#020617]">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/10 blur-[100px] md:blur-[150px] -z-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-600/5 blur-[100px] md:blur-[150px] -z-10 rounded-full animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-10 md:mb-12 text-center md:text-left">
                    <div className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-indigo-500 shadow-2xl">
                        <FaShieldAlt className="text-2xl md:text-4xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                            Review <span className="text-indigo-500">Console</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2">
                            Pending Verification: <span className="text-indigo-400">{tuitions.length}</span>
                        </p>
                    </div>
                </div>

                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <table className="table w-full border-separate border-spacing-y-3 px-6 pb-6">
                        <thead>
                            <tr className="text-slate-500 border-none uppercase text-[10px] tracking-[0.3em]">
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
                                        className="bg-white/[0.03] hover:bg-white/[0.06] transition-all group"
                                    >
                                        <td className="rounded-l-2xl pl-8 font-mono text-slate-600 italic">{i + 1}</td>
                                        <td className="font-bold text-white italic tracking-wide">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 bg-indigo-500 rounded-full animate-ping"></div>
                                                {t.subject}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                                                <FaLayerGroup className="text-indigo-500/40" /> {t.class}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                                                <FaMapMarkerAlt className="text-indigo-500/40" /> {t.location}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-lg font-black text-indigo-400 uppercase italic tracking-tighter">৳{t.budget}</span>
                                        </td>
                                        <td className="rounded-r-2xl pr-8 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => handleAction(t._id, "approved")} className="p-3 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"><FaCheck /></button>
                                                <button onClick={() => handleAction(t._id, "rejected")} className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><FaTimes /></button>
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
                                className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 bg-indigo-500 rounded-full"></div>
                                        <h4 className="font-black text-white italic uppercase tracking-wide">{t.subject}</h4>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-600">#{i + 1}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <FaLayerGroup className="text-indigo-500/40" /> {t.class}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <FaMapMarkerAlt className="text-indigo-500/40" /> {t.location}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] uppercase font-black text-slate-600 tracking-widest mb-1">Budget</p>
                                        <p className="text-xl font-black text-indigo-400 italic">৳{t.budget}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                                    <button
                                        onClick={() => handleAction(t._id, "approved")}
                                        className="flex items-center justify-center gap-2 py-3 bg-green-500/10 text-green-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-green-500/10 active:scale-95 transition-transform"
                                    >
                                        <FaCheck /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(t._id, "rejected")}
                                        className="flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-500/10 active:scale-95 transition-transform"
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
                        <div className="p-8 bg-white/5 rounded-full border border-white/10 mb-6">
                            <FaInbox className="text-slate-700" size={50} />
                        </div>
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] italic text-[10px] md:text-xs">
                            Queue Clear: No Pending Posts
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ApplyTution;