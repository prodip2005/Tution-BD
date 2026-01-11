import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Providers/AuthContext';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { motion } from "framer-motion";

import {
    FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiClock, FiInfo, FiCheckCircle, FiStar
} from "react-icons/fi";
import { HiOutlineAcademicCap, HiSparkles } from "react-icons/hi2";

const ApplyTutor = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (!user?.email) return;
        axiosSecure.get(`/tutors/check/${user.email}`)
            .then(res => {
                if (res.data?.applied) {
                    setAlreadyApplied(true);
                    setTutorData(res.data.tutor);

                    if (res.data.tutor?.status === "pending") {
                        Object.keys(res.data.tutor).forEach(key =>
                            setValue(key, res.data.tutor[key])
                        );
                        setValue("subject", res.data.tutor.subjects);
                        setValue("about", res.data.tutor.bio);
                    }
                }
            })
            .catch()
            .finally(() => setLoading(false));
    }, [user, axiosSecure, setValue]);

    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            email: user.email,
            phone: data.phone,
            age: data.age,
            institution: data.institution,
            subjects: data.subject,
            experience: data.experience,
            bio: data.about,
        };

        const request =
            alreadyApplied && tutorData?.status === "pending"
                ? axiosSecure.patch(`/tutors/${tutorData._id}`, payload)
                : axiosSecure.post("/tutors", payload);

        request
            .then(res => {
                if (res.data.success) {
                    Swal.fire({
                        title: "Success",
                        text: "Profile sync completed",
                        icon: "success",
                        background: 'var(--color-base-100, #111)',
                        color: 'var(--color-base-content, #fff)',
                        confirmButtonColor: 'var(--color-primary, #6366f1)'
                    });
                    setTutorData({ ...payload, status: "pending" });
                    setAlreadyApplied(true);
                }
            })
            .catch(() => Swal.fire({
                title: "Error",
                text: "Transmission failed",
                icon: "error",
                background: 'var(--color-base-100, #111)',
                color: 'var(--color-base-content, #fff)'
            }));
    };

    const Bubbles = () => (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-primary/5 rounded-full blur-[100px]"
                    style={{
                        width: Math.random() * 300 + 200,
                        height: Math.random() * 300 + 200,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{ y: [0, -60, 0], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-base-100">
                <div className="relative size-32">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full"
                    />
                </div>
                <p className="text-primary text-xs font-black tracking-[0.6em] mt-8 uppercase italic animate-pulse">Scanning Identity...</p>
            </div>
        );
    }

    if (alreadyApplied && tutorData?.status !== 'pending') {
        return (
            <div className="min-h-screen bg-base-100 flex justify-center items-center px-4 relative overflow-hidden">
                <Bubbles />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full p-12 bg-base-200/50 dark:bg-white/3 backdrop-blur-3xl rounded-4xl border border-base-300 dark:border-white/10 shadow-2xl text-center"
                >
                    <div className="relative inline-block mb-8">
                        <FiCheckCircle className="text-primary" size={80} />
                        <HiSparkles className="absolute -top-2 -right-2 text-warning animate-pulse" size={24} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-base-content mb-4 uppercase italic tracking-tighter">
                        Status: <span className="text-primary not-italic">{tutorData.status}</span>
                    </h2>
                    <p className="text-base-content/60 font-bold leading-relaxed italic">
                        {tutorData.status === 'approved'
                            ? "Access Granted. Your profile is now part of the Elite Mentor Network."
                            : "Application Encrypted. Our administrators are currently reviewing your credentials."}
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-16 px-4 relative overflow-hidden text-base-content">
            <Bubbles />
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-1.5 bg-primary/10 text-primary rounded-full font-black text-[10px] tracking-[0.3em] uppercase border border-primary/20 mb-6"
                    >
                        <HiSparkles /> Elite Recruitment
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-base-content leading-tight uppercase italic tracking-tighter"
                    >
                        {alreadyApplied ? 'Sync' : 'Apply as'} <span className="text-primary not-italic">Tutor</span>
                    </motion.h2>
                    <p className="mt-4 text-base-content/40 font-bold uppercase tracking-widest text-xs">Initiate your journey into the professional teaching network.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-base-200/50 dark:bg-white/2 backdrop-blur-3xl rounded-4xl border border-base-300 dark:border-white/10 shadow-2xl p-8 md:p-14"
                >
                    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><FiUser className="text-primary" /> Full Identity</label>
                            <input {...register('name', { required: true })} defaultValue={user?.displayName} className="w-full px-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none font-bold text-base-content transition-all italic placeholder:text-base-content/30" placeholder="Your Name" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><FiMail className="text-primary" /> Secure Email</label>
                            <input readOnly value={user?.email} className="w-full px-6 py-4 bg-base-300/50 dark:bg-black/40 border border-base-300 dark:border-white/5 rounded-2xl font-bold text-base-content/50 cursor-not-allowed" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><FiPhone className="text-primary" /> Comm Line</label>
                            <input {...register('phone', { required: true })} placeholder="+880 1XXX..." className="w-full px-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none font-bold text-base-content transition-all placeholder:text-base-content/30" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><FiCalendar className="text-primary" /> Cycle Count (Age)</label>
                            <input type="number" {...register('age', { required: true })} className="w-full px-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none font-bold text-base-content transition-all placeholder:text-base-content/30" />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><HiOutlineAcademicCap className="text-primary" /> Academic Foundation</label>
                            <input {...register('institution', { required: true })} placeholder="University / Board" className="w-full px-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none font-bold text-base-content transition-all placeholder:text-base-content/30" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><FiBook className="text-primary" /> Core Expertise</label>
                            <input {...register('subject', { required: true })} placeholder="Physics, Math..." className="w-full px-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none font-bold text-base-content transition-all placeholder:text-base-content/30" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><FiClock className="text-primary" /> Field Experience</label>
                            <select {...register('experience', { required: true })} className="w-full px-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none font-bold text-base-content cursor-pointer appearance-none">
                                <option className='bg-base-200 text-base-content' value="">Select Level</option>
                                <option className='bg-base-200 text-base-content' value="0-1">0-1 Year</option>
                                <option className='bg-base-200 text-base-content' value="1-3">1-3 Years</option>
                                <option className='bg-base-200 text-base-content' value="3+">3+ Years</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1 italic"><FiInfo className="text-primary" /> Pedagogical Style (Bio)</label>
                            <textarea {...register('about')} className="w-full px-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-4xl outline-none font-bold text-base-content transition-all h-32 italic placeholder:text-base-content/30" />
                        </div>
                        <div className="md:col-span-2 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-6 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-3"
                            >
                                <FiStar /> {alreadyApplied ? 'Sync Data' : 'Execute Application'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ApplyTutor;