import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Providers/AuthContext';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Lottie from "lottie-react";
import { motion } from "framer-motion";

import {
    FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiClock, FiMapPin, FiInfo, FiCheckCircle, FiStar
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

                        // ✅ FINAL FIX
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
            subjects: data.subject,   // ✅ FIX
            experience: data.experience,
            bio: data.about,          // ✅ FIX
        };

        const request =
            alreadyApplied && tutorData?.status === "pending"
                ? axiosSecure.patch(`/tutors/${tutorData._id}`, payload)
                : axiosSecure.post("/tutors", payload);

        request
            .then(res => {
                if (res.data.success) {
                    Swal.fire("Success", "Profile updated successfully", "success");
                    setTutorData({ ...payload, status: "pending" }); // ✅ FIX
                    setAlreadyApplied(true);
                }
            })
            .catch(() => Swal.fire("Error", "Request failed", "error"));
    };


    // Background Animated Bubbles Component
    const Bubbles = () => (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-primary/10 rounded-full blur-3xl"
                    style={{
                        width: Math.random() * 200 + 100,
                        height: Math.random() * 200 + 100,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <Lottie className="w-64" path="https://lottie.host/890453d1-419b-449a-bd9e-269608406180/7eL6R9oV7j.json" loop={true} />
                <p className="text-2xl font-bold text-primary animate-pulse tracking-tighter mt-4 italic">VERIFYING YOUR IDENTITY...</p>
            </div>
        );
    }

    if (alreadyApplied && tutorData?.status !== 'pending') {
        return (
            <div className="relative flex justify-center items-center min-h-[80vh] px-4">
                <Bubbles />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full p-10 bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[3rem] border-2 border-primary/20 shadow-2xl text-center"
                >
                    <div className="relative inline-block">
                        <FiCheckCircle className="text-primary mb-6" size={100} />
                        <HiSparkles className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" size={30} />
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
                        Status: <span className="text-primary uppercase">{tutorData.status}</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        {tutorData.status === 'approved'
                            ? "🎉 Excellence! Your profile is verified. You can now connect with students."
                            : "🤝 Your application is in the safe hands of our admins. Hang tight!"}
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen py-16 px-4 overflow-hidden">
            <Bubbles />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm mb-6 border border-primary/20"
                    >
                        <HiSparkles /> BECOME A MENTOR
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight"
                    >
                        {alreadyApplied ? 'Edit' : 'Apply as'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Tutor</span>
                    </motion.h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-medium max-w-2xl mx-auto">
                        Share your knowledge and inspire the next generation of leaders.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] p-8 md:p-14"
                >
                    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Name Input */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                                <FiUser className="text-primary text-base" /> Full Name
                            </label>
                            <input
                                {...register('name', { required: 'Name required' })}
                                defaultValue={user?.displayName}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-gray-800 dark:text-white transition-all focus:shadow-lg focus:shadow-primary/5"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                                <FiMail className="text-primary text-base" /> Email Address
                            </label>
                            <input readOnly value={user?.email} className="w-full px-6 py-4 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-2xl font-bold text-gray-500 cursor-not-allowed" />
                        </div>

                        {/* Phone */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1"><FiPhone className="text-primary" /> Phone Number</label>
                            <input {...register('phone', { required: true })} placeholder="+880 1XXX-XXXXXX" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-gray-800 dark:text-white transition-all" />
                        </div>

                        {/* Age */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1"><FiCalendar className="text-primary" /> Age</label>
                            <input type="number" {...register('age', { required: true })} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-gray-800 dark:text-white transition-all" />
                        </div>

                        {/* Institution */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1"><HiOutlineAcademicCap className="text-primary" size={18} /> Institution / University</label>
                            <input {...register('institution', { required: true })} placeholder="University of Dhaka" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-gray-800 dark:text-white transition-all" />
                        </div>

                        {/* Subject */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1"><FiBook className="text-primary" /> Expertise</label>
                            <input {...register('subject', { required: true })} placeholder="Physics, Mathematics" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-gray-800 dark:text-white transition-all" />
                        </div>

                        {/* Experience */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1"><FiClock className="text-primary" /> Experience</label>
                            <select {...register('experience', { required: true })} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-gray-800 dark:text-white cursor-pointer appearance-none">
                                <option value="">Select Experience</option>
                                <option value="0-1">0-1 Year</option>
                                <option value="1-3">1-3 Years</option>
                                <option value="3+">3+ Years</option>
                            </select>
                        </div>

                        {/* About Area */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1"><FiInfo className="text-primary" /> Tell us about your teaching style</label>
                            <textarea {...register('about')} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/30 rounded-[2rem] outline-none font-bold text-gray-800 dark:text-white transition-all h-32" />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 mt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-6 bg-primary text-white font-black rounded-3xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-primary/50 transition-all uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-3"
                            >
                                <FiStar className="animate-spin-slow" /> {alreadyApplied ? 'Update Profile' : 'Confirm Application'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ApplyTutor;