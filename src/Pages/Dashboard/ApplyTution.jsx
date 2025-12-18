import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaLayerGroup, FaMapMarkerAlt, FaShieldAlt, FaInbox } from "react-icons/fa";

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
        <div className="min-h-screen relative overflow-hidden px-4 py-10 bg-[#020617]">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[150px] -z-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[150px] -z-10 rounded-full animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-12 justify-center md:justify-start">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-3xl text-indigo-500 shadow-2xl">
                        <FaShieldAlt size={35} />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                            Review <span className="text-indigo-500">Console</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">
                            Pending Verification: <span className="text-indigo-400">{tuitions.length}</span>
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
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
                                        transition={{ delay: i * 0.05 }}
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
                                        <td className="rounded-r-2xl pr-8">
                                            <div className="flex justify-end gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: "#22c55e", color: "#fff" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleAction(t._id, "approved")}
                                                    className="p-3 bg-green-500/10 text-green-500 rounded-xl transition-all border border-green-500/20"
                                                >
                                                    <FaCheck />
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: "#ef4444", color: "#fff" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleAction(t._id, "rejected")}
                                                    className="p-3 bg-red-500/10 text-red-500 rounded-xl transition-all border border-red-500/20"
                                                >
                                                    <FaTimes />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {/* --- Improved Empty State --- */}
                    {tuitions.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 bg-white/5 rounded-full border border-white/10 mb-6"
                            >
                                <FaInbox className="text-slate-700" size={50} />
                            </motion.div>
                            <p className="text-slate-500 font-black uppercase tracking-[0.5em] italic text-xs">
                                Queue Clear: No Pending Posts
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ApplyTution;