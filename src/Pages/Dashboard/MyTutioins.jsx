import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrashAlt, FaBookOpen, FaMapMarkerAlt } from "react-icons/fa";

const My_Tuitions = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [editTuition, setEditTuition] = useState(null);

    const { data: myTuitions = [], refetch, isLoading } = useQuery({
        queryKey: ["my-tuitions", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/tuitions?email=${user.email}`);
            return res.data || [];
        },
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This tuition will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            background: '#020617',
            color: '#fff',
            confirmButtonColor: "#ef4444",
            backdrop: `rgba(0,0,0,0.8)`
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(`/tuitions/${id}?email=${user.email}`);
        if (res.data.success) {
            Swal.fire({
                title: "Deleted!",
                icon: "success",
                background: '#020617',
                color: '#fff'
            });
            refetch();
        }
    };

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

        const res = await axiosSecure.put(`/tuitions/${editTuition._id}`, updatedData);
        if (res.data.success) {
            Swal.fire({
                title: "Updated!",
                icon: "success",
                background: '#020617',
                color: '#fff'
            });
            setEditTuition(null);
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
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    >
                        <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Syncing Your Data
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-12 bg-transparent"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-5 mb-14 justify-center md:justify-start">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[1.5rem] text-indigo-500 shadow-2xl">
                    <FaBookOpen size={35} className="animate-pulse" />
                </div>
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                        My <span className="text-indigo-500">Tuitions</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Active Entries: {myTuitions.length}</p>
                </div>
            </div>

            {/* Glassy Table Container */}
            <div className="overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <table className="table w-full border-separate border-spacing-y-3 px-6 pb-6">
                    <thead>
                        <tr className="text-slate-500 border-none uppercase text-[10px] tracking-[0.3em]">
                            <th className="bg-transparent pl-8">#</th>
                            <th className="bg-transparent">Subject Details</th>
                            <th className="bg-transparent">Target Class</th>
                            <th className="bg-transparent">Location</th>
                            <th className="bg-transparent">Budget</th>
                            <th className="bg-transparent">Access Status</th>
                            <th className="bg-transparent text-right pr-8">Operations</th>
                        </tr>
                    </thead>

                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {myTuitions.map((t, i) => (
                                <motion.tr
                                    key={t._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/[0.03] hover:bg-white/[0.08] transition-all group"
                                >
                                    <td className="font-mono text-slate-600 italic pl-8 rounded-l-2xl">{i + 1}</td>
                                    <td className="font-black text-white italic group-hover:text-indigo-400 transition-colors">{t.subject}</td>
                                    <td className="text-slate-400 font-medium">{t.class}</td>
                                    <td>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <FaMapMarkerAlt className="text-indigo-500/30" />
                                            <span className="group-hover:text-slate-200 transition-colors">{t.location}</span>
                                        </div>
                                    </td>
                                    <td className="text-indigo-400 font-black uppercase italic tracking-tighter">৳{t.budget}</td>
                                    <td>
                                        <span className={`px-4 py-1.5 rounded-lg font-black uppercase text-[9px] tracking-widest border border-white/5 shadow-xl ${t.status === "booked"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="rounded-r-2xl pr-8">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                disabled={t.status === "booked"}
                                                className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                                                onClick={() => setEditTuition(t)}
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-lg shadow-red-500/5"
                                                onClick={() => handleDelete(t._id)}
                                            >
                                                <FaTrashAlt size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {myTuitions.length === 0 && (
                    <div className="text-center py-28">
                        <div className="inline-block p-6 bg-white/5 rounded-full border border-white/5 mb-6 text-slate-700">
                            <FaBookOpen size={40} />
                        </div>
                        <p className="text-slate-600 font-black uppercase tracking-[0.5em] italic text-[10px]">
                            Database Empty: No tuition units found.
                        </p>
                    </div>
                )}
            </div>

            {/* ================= EDIT MODAL (CYBER GLASS) ================= */}
            <AnimatePresence>
                {editTuition && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#020617] border border-white/10 p-10 rounded-[3.5rem] w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-8 relative z-10 leading-none">
                                Edit <span className="text-indigo-500">Tuition</span>
                            </h3>

                            <form onSubmit={handleEditSubmit} className="space-y-5 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase font-black text-slate-500 ml-1 tracking-[0.2em]">Subject Name</label>
                                    <input name="subject" defaultValue={editTuition.subject} className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-2xl outline-none text-white font-bold transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase font-black text-slate-500 ml-1 tracking-[0.2em]">Target Class</label>
                                    <input name="class" defaultValue={editTuition.class} className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-2xl outline-none text-white font-bold transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase font-black text-slate-500 ml-1 tracking-[0.2em]">Location</label>
                                    <input name="location" defaultValue={editTuition.location} className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-2xl outline-none text-white font-bold transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase font-black text-slate-500 ml-1 tracking-[0.2em]">Monthly Budget (৳)</label>
                                    <input name="budget" defaultValue={editTuition.budget} className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-2xl outline-none text-white font-bold transition-all" />
                                </div>

                                <div className="flex justify-end gap-3 pt-8">
                                    <button type="button" onClick={() => setEditTuition(null)} className="px-6 py-3 rounded-xl font-black text-slate-500 hover:text-white transition-all uppercase text-[10px] tracking-widest">Terminate</button>
                                    <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all uppercase text-[10px] tracking-widest">Update File</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default My_Tuitions;