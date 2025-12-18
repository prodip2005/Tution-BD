import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";
import { FaUserCheck, FaUserTimes, FaUniversity, FaMapMarkerAlt, FaBook, FaUserShield } from 'react-icons/fa';

// Animations
const loaderAnim = "https://lottie.host/890453d1-419b-449a-bd9e-269608406180/7eL6R9oV7j.json";
const emptyAnim = "https://lottie.host/81e59267-3a13-431d-8547-49d3298c4d62/X6YxX8rS2S.json";

const AppliedTutor = () => {
    const axiosSecure = useAxiosSecure();
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTutors = async () => {
        try {
            const res = await axiosSecure.get('/tutors?status=pending');
            setTutors(res.data.tutors || []);
        } catch (err) {
            // console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    const handleAction = async (id, status) => {
        const confirm = await Swal.fire({
            title: status === 'approved' ? 'Approve Tutor?' : 'Reject Tutor?',
            text: `This tutor will be marked as ${status}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Proceed',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: status === 'approved' ? '#22c55e' : '#ef4444'
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/tutors/admin-approval/${id}`, { status });
            if (res.data.success) {
                Swal.fire({
                    title: 'Action Successful',
                    icon: 'success',
                    background: '#0f172a',
                    color: '#fff'
                });
                fetchTutors();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ title: 'Error', icon: 'error', background: '#0f172a', color: '#fff' });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">

                    {/* --- Outer Rotating Ring --- */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                    />

                    {/* --- Middle Dashed Orbit --- */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full"
                    />

                    {/* --- Core Pulsing Orb --- */}
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.7, 1, 0.7],
                            boxShadow: [
                                "0 0 15px rgba(79, 70, 229, 0.4)",
                                "0 0 35px rgba(79, 70, 229, 0.6)",
                                "0 0 15px rgba(79, 70, 229, 0.4)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center"
                    >
                        {/* Tiny Center White Point */}
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>

                    {/* --- Satellite Dot --- */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40"
                    >
                        <div className="w-2 h-2 bg-indigo-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#818cf8]" />
                    </motion.div>
                </div>

                {/* --- Loading Text Section --- */}
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-[10px] md:text-xs font-black tracking-[0.6em] uppercase italic"
                    >
                        Syncing Applications
                    </motion.p>

                    {/* Animated Slim Progress Line */}
                    <div className="w-32 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
                        <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            className="absolute w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_8px_rgba(79,70,229,0.8)]"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-[2rem] text-primary shadow-2xl">
                            <FaUserShield size={35} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                                Tutor <span className="text-primary">Requests</span>
                            </h2>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em] mt-1">
                                Pending Approval: {tutors.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Glassy Table Area */}
                <div className="overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl">
                    <table className="table w-full border-separate border-spacing-y-3 px-6 pb-6">
                        <thead>
                            <tr className="text-gray-600 border-none uppercase text-[10px] tracking-[0.3em]">
                                <th className="bg-transparent pl-8">#</th>
                                <th className="bg-transparent">Tutor Profile</th>
                                <th className="bg-transparent">Academic Info</th>
                                <th className="bg-transparent text-center">Location</th>
                                <th className="bg-transparent text-center">Status</th>
                                <th className="bg-transparent text-right pr-8">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {tutors.map((tutor, index) => (
                                    <motion.tr
                                        key={tutor._id}
                                        layout
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white/[0.03] hover:bg-white/[0.08] transition-all group"
                                    >
                                        <td className="rounded-l-2xl pl-8 font-mono text-gray-600 italic">{index + 1}</td>

                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20">
                                                    {tutor.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white italic">{tutor.name}</p>
                                                    <p className="text-[10px] text-gray-500 lowercase">{tutor.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-300 flex items-center gap-2">
                                                    <FaUniversity className="text-primary/40" /> {tutor.institution}
                                                </span>
                                                <span className="text-[10px] text-gray-500 flex items-center gap-2 uppercase tracking-tighter">
                                                    <FaBook className="text-primary/40" /> {tutor.subjects}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="text-center">
                                            <span className="text-xs text-gray-400 flex items-center justify-center gap-1 italic">
                                                <FaMapMarkerAlt size={10} /> {tutor.location}
                                            </span>
                                        </td>

                                        <td className="text-center">
                                            <span className="badge border-none bg-orange-500/10 text-orange-400 font-black text-[9px] px-3 py-3 rounded-lg uppercase tracking-widest shadow-lg">
                                                {tutor.status}
                                            </span>
                                        </td>

                                        <td className="rounded-r-2xl pr-8">
                                            <div className="flex justify-end gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleAction(tutor._id, 'approved')}
                                                    className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                                >
                                                    <FaUserCheck size={16} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleAction(tutor._id, 'rejected')}
                                                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                >
                                                    <FaUserTimes size={16} />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {tutors.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Lottie animationData={null} path={emptyAnim} loop className="w-48 opacity-30" />
                            <p className="text-gray-600 font-bold uppercase tracking-[0.4em] italic mt-4 text-center px-4">
                                Excellent! No pending tutor reviews in queue.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AppliedTutor;