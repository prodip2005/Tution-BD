import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrashAlt, FaBookOpen, FaMapMarkerAlt, FaLayerGroup, FaMoneyBillWave } from "react-icons/fa";

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
            text: "Permanently delete this entry?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            background: '#020617',
            color: '#fff',
            confirmButtonColor: "#ef4444",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(`/tuitions/${id}?email=${user.email}`);
        if (res.data.success) {
            Swal.fire({ title: "Deleted!", icon: "success", background: '#020617', color: '#fff' });
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
            Swal.fire({ title: "Updated!", icon: "success", background: '#020617', color: '#fff' });
            setEditTuition(null);
            refetch();
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                </div>
                <div className="mt-8 flex flex-col items-center gap-3">
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-indigo-400 text-[10px] font-black tracking-[0.4em] uppercase italic">Syncing Data</motion.p>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-2 md:px-4 py-8 md:py-12 bg-transparent">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 mb-8 md:mb-14 justify-center md:justify-start">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl md:rounded-[1.5rem] text-indigo-500">
                    <FaBookOpen size={24} className="md:w-[35px] md:h-[35px] animate-pulse" />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                        My <span className="text-indigo-500">Tuitions</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-[0.2em] mt-1 md:mt-2">Total Units: {myTuitions.length}</p>
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
                            <th className="bg-transparent">Budget</th>
                            <th className="bg-transparent">Status</th>
                            <th className="bg-transparent text-right pr-8">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myTuitions.map((t, i) => (
                            <tr key={t._id} className="bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
                                <td className="font-mono text-slate-600 italic pl-8 rounded-l-2xl">{i + 1}</td>
                                <td className="font-black text-white italic group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{t.subject}</td>
                                <td className="text-slate-400 font-medium">{t.class}</td>
                                <td><div className="flex items-center gap-2 text-slate-400"><FaMapMarkerAlt className="text-indigo-500/30" />{t.location}</div></td>
                                <td className="text-indigo-400 font-black uppercase italic tracking-tighter">৳{t.budget}</td>
                                <td>
                                    <span className={`px-4 py-1.5 rounded-lg font-black uppercase text-[9px] tracking-widest border border-white/5 ${t.status === "booked" ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="rounded-r-2xl pr-8 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button disabled={t.status === "booked"} className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-20 border border-indigo-500/20" onClick={() => setEditTuition(t)}><FaEdit size={16} /></button>
                                        <button className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20" onClick={() => handleDelete(t._id)}><FaTrashAlt size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Grid-cols-2 */}
            <div className="md:hidden grid grid-cols-2 gap-2.5">
                <AnimatePresence mode="popLayout">
                    {myTuitions.map((t, i) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 flex flex-col justify-between shadow-xl"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[7px] font-black text-slate-600">ID {i + 1}</span>
                                    <span className={`px-1.5 py-0.5 rounded-md text-[6px] font-black uppercase tracking-widest ${t.status === 'booked' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {t.status}
                                    </span>
                                </div>

                                <h3 className="text-[11px] font-black text-white uppercase italic leading-tight truncate mb-2">
                                    {t.subject}
                                </h3>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1 text-slate-400 text-[8px] font-bold">
                                        <FaLayerGroup className="text-indigo-500/40" size={8} />
                                        <span className="truncate">{t.class}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 text-[8px] font-bold">
                                        <FaMapMarkerAlt className="text-indigo-500/40" size={8} />
                                        <span className="truncate">{t.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-indigo-400 text-[9px] font-black italic">
                                        <FaMoneyBillWave className="text-indigo-500/40" size={9} />
                                        ৳{t.budget}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                                <button
                                    disabled={t.status === "booked"}
                                    onClick={() => setEditTuition(t)}
                                    className="flex-1 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg flex justify-center items-center border border-indigo-500/20 disabled:opacity-20 active:scale-95"
                                >
                                    <FaEdit size={11} />
                                </button>
                                <button
                                    onClick={() => handleDelete(t._id)}
                                    className="flex-1 py-1.5 bg-red-500/10 text-red-400 rounded-lg flex justify-center items-center border border-red-500/20 active:scale-95"
                                >
                                    <FaTrashAlt size={11} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {myTuitions.length === 0 && (
                <div className="text-center py-20 opacity-40">
                    <FaBookOpen size={30} className="mx-auto mb-4" />
                    <p className="text-[9px] font-black uppercase tracking-widest">No entries found</p>
                </div>
            )}

            {/* Edit Modal (Cyber Glass) */}
            <AnimatePresence>
                {editTuition && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#020617] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm">
                            <h3 className="text-xl font-black text-white uppercase italic mb-6">Modify <span className="text-indigo-500">File</span></h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest ml-1">Subject</label>
                                    <input name="subject" defaultValue={editTuition.subject} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest ml-1">Class</label>
                                    <input name="class" defaultValue={editTuition.class} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-indigo-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest ml-1">Location</label>
                                        <input name="location" defaultValue={editTuition.location} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest ml-1">Budget</label>
                                        <input name="budget" defaultValue={editTuition.budget} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={() => setEditTuition(null)} className="flex-1 py-3 text-slate-500 font-black uppercase text-[9px] tracking-widest">Cancel</button>
                                    <button className="flex-1 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[9px] tracking-widest">Update</button>
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