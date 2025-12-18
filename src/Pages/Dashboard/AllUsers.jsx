import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import {
    FaUserShield,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaTrash,
    FaEye,
    FaUsersCog,
    FaIdBadge,
    FaUniversity,
    FaPhoneAlt,
    FaEnvelope
} from "react-icons/fa";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [activeRole, setActiveRole] = useState("student");
    const [selectedUser, setSelectedUser] = useState(null);

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ["all-users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data.users || [];
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-xs font-black tracking-[0.6em] uppercase italic"
                    >
                        Accessing Database
                    </motion.p>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter((user) => user.role === activeRole);

    const handleRoleChange = async (email, role) => {
        const confirm = await Swal.fire({
            title: "Confirm Role Change?",
            text: `Updating user access to ${role}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            background: '#020617',
            color: '#fff',
            confirmButtonColor: "#6366f1"
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/users/role/${email}`, { role });
            if (!res.data.success) {
                Swal.fire({ title: "Blocked ❌", text: res.data.message || "Action not allowed", icon: "error", background: '#020617', color: '#fff' });
                return;
            }
            Swal.fire({ title: "Updated!", icon: "success", background: '#020617', color: '#fff' });
            refetch();
        } catch (err) {
            Swal.fire({ title: "Error", text: "Update failed", icon: "error", background: '#020617', color: '#fff' });
        }
    };

    const handleDelete = async (email) => {
        const confirm = await Swal.fire({
            title: "Permanent Removal?",
            text: "This user record will be wiped from existence!",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Erase User",
            background: '#020617',
            color: '#fff',
            confirmButtonColor: "#ef4444"
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/users/${email}`);
            if (!res.data.success) {
                Swal.fire({ title: "Blocked ❌", text: res.data.message, icon: "error", background: '#020617', color: '#fff' });
                return;
            }
            Swal.fire({ title: "Deleted!", icon: "success", background: '#020617', color: '#fff' });
            refetch();
        } catch (err) {
            Swal.fire({ title: "Error", text: "Delete failed", icon: "error", background: '#020617', color: '#fff' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-6 md:py-10 bg-transparent"
        >
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="p-3 md:p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl md:rounded-3xl text-indigo-500 shadow-2xl">
                        <FaUsersCog className="text-2xl md:text-4xl animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-tight">
                            Control <span className="text-indigo-500">Center</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em]">Registry: {users.length}</p>
                    </div>
                </div>

                {/* ROLE FILTER SWITCHER - Scrollable on Mobile */}
                <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 bg-white/5 p-1.5 md:p-2 rounded-2xl border border-white/10 backdrop-blur-md gap-2 no-scrollbar">
                    {[
                        { id: "admin", icon: <FaUserShield />, label: "Admins" },
                        { id: "tutor", icon: <FaChalkboardTeacher />, label: "Tutors" },
                        { id: "student", icon: <FaUserGraduate />, label: "Students" }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setActiveRole(btn.id)}
                            className={`flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-black uppercase text-[8px] md:text-[9px] tracking-[0.15em] transition-all duration-300 whitespace-nowrap flex-1 md:flex-none ${activeRole === btn.id
                                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            {btn.icon} {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl">
                <table className="table w-full border-separate border-spacing-y-3 px-6 pb-4">
                    <thead>
                        <tr className="text-slate-600 border-none uppercase text-[10px] tracking-[0.3em]">
                            <th className="bg-transparent pl-8">#</th>
                            <th className="bg-transparent">Identity</th>
                            <th className="bg-transparent">Contact</th>
                            <th className="bg-transparent">Access</th>
                            <th className="bg-transparent text-right pr-8">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {filteredUsers.map((user, i) => (
                                <motion.tr
                                    key={user._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/[0.03] hover:bg-white/[0.07] transition-all group"
                                >
                                    <td className="rounded-l-2xl pl-8 font-mono text-slate-600 italic">{i + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <img src={user.image || "https://i.ibb.co/2FsfXqM/avatar.png"} className="size-10 object-cover rounded-xl border border-white/10" alt="" />
                                            <span className="font-black text-white uppercase italic text-sm">{user.name || "UNNAMED"}</span>
                                        </div>
                                    </td>
                                    <td className="text-slate-400 lowercase text-[11px]">{user.email}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-lg font-black uppercase text-[9px] border border-white/5 ${user.role === 'admin' ? 'text-red-400 bg-red-500/10' : user.role === 'tutor' ? 'text-green-400 bg-green-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="rounded-r-2xl pr-8 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => setSelectedUser(user)} className="p-2.5 bg-white/5 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><FaEye /></button>
                                            {user.role !== "admin" && <button onClick={() => handleRoleChange(user.email, "admin")} className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[8px] font-black uppercase">+ Admin</button>}
                                            {user.role !== "tutor" && <button onClick={() => handleRoleChange(user.email, "tutor")} className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-[8px] font-black uppercase">+ Tutor</button>}
                                            {user.role !== "student" && <button onClick={() => handleRoleChange(user.email, "student")} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[8px] font-black uppercase">+ Student</button>}
                                            <button onClick={() => handleDelete(user.email)} className="p-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><FaTrash /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, i) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={user.image || "https://i.ibb.co/2FsfXqM/avatar.png"} className="size-12 rounded-2xl object-cover border border-white/10" alt="" />
                                    <div>
                                        <h4 className="font-black text-white italic uppercase text-sm leading-tight">{user.name || "UNNAMED"}</h4>
                                        <p className="text-[10px] text-slate-500 lowercase flex items-center gap-1 mt-1 truncate max-w-[150px]">
                                            <FaEnvelope size={8} /> {user.email}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-md font-black uppercase text-[8px] tracking-tighter ${user.role === 'admin' ? 'text-red-400 bg-red-500/10' : user.role === 'tutor' ? 'text-green-400 bg-green-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                                    {user.role}
                                </span>
                            </div>

                            {/* Mobile Quick Actions */}
                            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                                {user.role !== "admin" && (
                                    <button onClick={() => handleRoleChange(user.email, "admin")} className="py-2 bg-red-500/10 text-red-500 rounded-xl text-[8px] font-black uppercase tracking-tighter">Admin</button>
                                )}
                                {user.role !== "tutor" && (
                                    <button onClick={() => handleRoleChange(user.email, "tutor")} className="py-2 bg-green-500/10 text-green-400 rounded-xl text-[8px] font-black uppercase tracking-tighter">Tutor</button>
                                )}
                                {user.role !== "student" && (
                                    <button onClick={() => handleRoleChange(user.email, "student")} className="py-2 bg-blue-500/10 text-blue-400 rounded-xl text-[8px] font-black uppercase tracking-tighter">Student</button>
                                )}
                                <button onClick={() => setSelectedUser(user)} className="py-2 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-tighter">
                                    <FaEye size={10} /> Profile
                                </button>
                                <button onClick={() => handleDelete(user.email)} className="py-2 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-tighter col-span-1">
                                    <FaTrash size={10} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredUsers.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                    <FaUsersCog size={40} className="text-slate-800 mb-4" />
                    <p className="text-slate-600 font-black uppercase tracking-widest italic text-[10px]">No units found in this sector.</p>
                </div>
            )}

            {/* MODAL (Responsive Optimized) */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#020617] border border-white/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-sm shadow-2xl relative"
                        >
                            <h3 className="text-2xl font-black text-white uppercase italic mb-6">User <span className="text-indigo-500">File</span></h3>
                            <div className="space-y-3">
                                <div className="flex justify-center mb-6">
                                    <img src={selectedUser.image || "https://i.ibb.co/2FsfXqM/avatar.png"} className="size-24 rounded-3xl object-cover border-2 border-indigo-500/20 shadow-2xl" alt="" />
                                </div>
                                <DetailItem icon={<FaIdBadge />} label="Identity" value={selectedUser.name} />
                                <DetailItem icon={<FaUniversity />} label="Institution" value={selectedUser.institution} />
                                <DetailItem icon={<FaPhoneAlt />} label="Contact" value={selectedUser.phone} />
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="mt-8 w-full py-3.5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[10px]">Close File</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 flex items-center gap-3">
        <div className="text-indigo-500 bg-indigo-500/10 p-2 rounded-lg">{icon}</div>
        <div className="overflow-hidden">
            <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest">{label}</p>
            <p className="text-white font-bold text-xs truncate">{value || "N/A"}</p>
        </div>
    </div>
);

export default AllUsers;