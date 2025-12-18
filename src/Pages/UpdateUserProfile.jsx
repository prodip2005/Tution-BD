import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../Providers/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { auth } from "../Firebase/firebase.init";
import { FiUser, FiCamera, FiMapPin, FiPhone, FiBookOpen, FiEdit3, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import { HiOutlineAcademicCap, HiSparkles } from "react-icons/hi2";

const UpdateUserProfile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (!user?.email) return;
        const loadUser = async () => {
            try {
                const res = await axiosSecure.get(`/users/${encodeURIComponent(user.email.toLowerCase())}`);
                if (res.data?.success) {
                    const dbUser = res.data.user;
                    setValue("name", dbUser.name || user.displayName || "");
                    setValue("role", dbUser.role || "student");
                    setValue("institution", dbUser.institution || "");
                    setValue("level", dbUser.level || "");
                    setValue("location", dbUser.location || "");
                    setValue("phone", dbUser.phone || "");
                    setValue("bio", dbUser.bio || "");
                    const img = dbUser.image || user.photoURL || "";
                    setPreview(img);
                    setValue("imageUrl", img);
                }
            } catch (err) { console.error("User load failed:", err); }
        };
        loadUser();
    }, [user, axiosSecure, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage(null);
        try {
            const payload = { ...data, image: data.imageUrl, email: user.email };
            const res = await axiosSecure.put("/users/profile", payload);
            if (!res.data.success) throw new Error("Database update failed");
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: data.name, photoURL: data.imageUrl });
            }
            setMessage({ type: "success", text: "Profile updated successfully! 🎉" });
            setTimeout(() => setMessage(null), 4000);
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Something went wrong" });
        } finally { setLoading(false); }
    };

    // Background Animated Bubbles Component
    const Bubbles = () => (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-primary/10 dark:bg-indigo-500/10 rounded-full blur-3xl"
                    style={{
                        width: Math.random() * 250 + 150,
                        height: Math.random() * 250 + 150,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -50, 0],
                        x: [0, 30, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: Math.random() * 7 + 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#050505] flex items-center justify-center p-4 md:p-10">
            <Bubbles />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl relative z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
                {/* Left Section: Aesthetic Profile View */}
                <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 p-10 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <motion.div whileHover={{ scale: 1.05 }} className="relative group z-10">
                        <div className="w-52 h-52 rounded-[2.5rem] overflow-hidden border-4 border-white/30 shadow-2xl relative">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <div className="w-full h-full bg-white/10 flex items-center justify-center text-6xl font-black">
                                    {watch("name")?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 p-4 rounded-2xl shadow-2xl border border-indigo-100 dark:border-gray-700"
                        >
                            <FiCamera size={24} />
                        </motion.div>
                    </motion.div>

                    <div className="mt-10 z-10">
                        <h3 className="text-3xl font-black tracking-tight mb-1">{watch("name") || "Full Name"}</h3>
                        <p className="opacity-70 font-medium text-indigo-100">{user?.email}</p>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 z-10">
                        <HiSparkles className="text-yellow-300" /> {watch("role") || "Member"}
                    </div>

                    <div className="mt-12 w-full text-left bg-black/20 p-8 rounded-[2rem] backdrop-blur-md border border-white/10 z-10">
                        <p className="text-sm italic font-medium leading-relaxed opacity-90 text-indigo-50">
                            "{watch("bio") || "Your personal bio will appear here once you share your story..."}"
                        </p>
                    </div>
                </div>

                {/* Right Section: Modern Dark Form */}
                <div className="lg:col-span-8 p-8 md:p-14 bg-transparent">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                                Account <span className="text-indigo-600 dark:text-indigo-400">Settings</span>
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Update your public identity and preferences.</p>
                        </div>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl self-start">
                            <FiEdit3 size={32} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1 flex items-center gap-2">
                                    <FiUser className="text-indigo-500" /> Full Name
                                </label>
                                <input {...register("name", { required: true })} className="w-full px-6 py-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 shadow-sm" placeholder="e.g. Abdullah Al Mamun" />
                            </div>

                            {/* Image URL */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1 flex items-center gap-2">
                                    <FiCamera className="text-indigo-500" /> Profile Image URL
                                </label>
                                <input {...register("imageUrl")} onChange={(e) => setPreview(e.target.value)} className="w-full px-6 py-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 shadow-sm" placeholder="https://..." />
                            </div>

                            {/* Institution */}
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1 flex items-center gap-2">
                                    <HiOutlineAcademicCap className="text-indigo-500 text-lg" /> Institution Name
                                </label>
                                <input {...register("institution")} className="w-full px-6 py-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 shadow-sm" placeholder="College or University" />
                            </div>

                            {/* Level & Location */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1 flex items-center gap-2">
                                    <FiBookOpen className="text-indigo-500" /> Level
                                </label>
                                <input {...register("level")} className="w-full px-6 py-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 shadow-sm" placeholder="Class / Year" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1 flex items-center gap-2">
                                    <FiMapPin className="text-indigo-500" /> Location
                                </label>
                                <input {...register("location")} className="w-full px-6 py-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 shadow-sm" placeholder="City, Country" />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">About Your Professional Journey</label>
                            <textarea {...register("bio")} rows={4} className="w-full px-6 py-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 shadow-sm resize-none" placeholder="Briefly describe yourself..." />
                        </div>

                        {/* Feedback Messages */}
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`p-5 rounded-[2rem] flex items-center gap-4 text-sm font-black shadow-xl ${message.type === "success" ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"}`}
                                >
                                    {message.type === "success" ? <FiCheckCircle size={22} /> : <FiAlertCircle size={22} />}
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Save Button */}
                        <motion.button
                            disabled={loading}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-6 rounded-3xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <FiLoader className="animate-spin text-lg" />
                            ) : (
                                <>Save Profile Changes <HiSparkles className="group-hover:animate-bounce" /></>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UpdateUserProfile;