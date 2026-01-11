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
            } catch (err) {
                // Silent error
            }
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
            setMessage({ type: "success", text: "Profile sync successful! ⚡" });
            setTimeout(() => setMessage(null), 4000);
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Sync Interrupted" });
        } finally { setLoading(false); }
    };

    const Bubbles = () => (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-indigo-500/5 rounded-full blur-[100px]"
                    style={{
                        width: Math.random() * 300 + 150,
                        height: Math.random() * 300 + 150,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -60, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-base-100 flex items-center justify-center p-4 md:p-10">
            <Bubbles />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl relative z-10 bg-base-100 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-base-300 dark:border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
                {/* Left Section: Profile Card Display */}
                <div className="lg:col-span-4 bg-linear-to-br from-primary/90 via-primary/80 to-primary/60 dark:from-indigo-900 dark:via-indigo-950 dark:to-black p-10 text-white flex flex-col items-center justify-center text-center relative border-b lg:border-b-0 lg:border-r border-white/5">

                    <motion.div whileHover={{ scale: 1.02 }} className="relative group z-10">
                        <div className="w-52 h-52 rounded-4xl overflow-hidden border-4 border-white/5 shadow-2xl relative">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-6xl font-black italic">
                                    {watch("name")?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-4 rounded-2xl shadow-2xl border border-white/10 text-white">
                            <FiCamera size={20} />
                        </div>
                    </motion.div>

                    <div className="mt-10 z-10">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-1">{watch("name") || "Member"}</h3>
                        <p className="text-white/60 font-bold text-sm tracking-tight">{user?.email}</p>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/20 text-white">
                        <HiSparkles className="animate-pulse" /> {watch("role") || "student"}
                    </div>

                    <div className="mt-10 w-full text-left bg-black/20 p-8 rounded-4xl border border-white/10 relative">
                        <p className="text-sm italic font-medium leading-relaxed text-white/80">
                            "{watch("bio") || "Define your journey in the digital realm..."}"
                        </p>
                        <div className="absolute top-4 right-6 opacity-10 font-serif text-5xl">"</div>
                    </div>
                </div>

                {/* Right Section: Settings Form */}
                <div className="lg:col-span-8 p-8 md:p-14 bg-transparent text-base-content">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none mb-3">
                                Profile <span className="text-primary not-italic">Sync</span>
                            </h2>
                            <p className="text-base-content/40 text-xs font-black uppercase tracking-widest italic">Modify your public core identity parameters.</p>
                        </div>
                        <div className="p-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/5 text-primary rounded-3xl">
                            <FiEdit3 size={28} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 ml-1 italic flex items-center gap-2">
                                    <FiUser className="text-primary" /> Identity Label
                                </label>
                                <input {...register("name", { required: true })} className="w-full px-6 py-4 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none transition-all font-bold text-base-content shadow-sm italic placeholder:text-base-content/30" placeholder="Your Name" />
                            </div>

                            {/* Image URL */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 ml-1 italic flex items-center gap-2">
                                    <FiCamera className="text-primary" /> Avatar Uplink (URL)
                                </label>
                                <input {...register("imageUrl")} onChange={(e) => setPreview(e.target.value)} className="w-full px-6 py-4 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none transition-all font-bold text-base-content shadow-sm italic placeholder:text-base-content/30" placeholder="https://image-source.com" />
                            </div>

                            {/* Institution */}
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 ml-1 italic flex items-center gap-2">
                                    <HiOutlineAcademicCap className="text-primary text-base" /> Foundation / Institution
                                </label>
                                <input {...register("institution")} className="w-full px-6 py-4 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none transition-all font-bold text-base-content shadow-sm italic placeholder:text-base-content/30" placeholder="Academy Name" />
                            </div>

                            {/* Level & Location */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 ml-1 italic flex items-center gap-2">
                                    <FiBookOpen className="text-primary" /> Grade / Status
                                </label>
                                <input {...register("level")} className="w-full px-6 py-4 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none transition-all font-bold text-base-content shadow-sm italic placeholder:text-base-content/30" placeholder="Current Level" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 ml-1 italic flex items-center gap-2">
                                    <FiMapPin className="text-primary" /> Sector / Location
                                </label>
                                <input {...register("location")} className="w-full px-6 py-4 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-2xl outline-none transition-all font-bold text-base-content shadow-sm italic placeholder:text-base-content/30" placeholder="City" />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 ml-1 italic">Professional Manifest / Bio</label>
                            <textarea {...register("bio")} rows={4} className="w-full px-6 py-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/5 focus:border-primary/50 rounded-4xl outline-none transition-all font-bold text-base-content shadow-sm resize-none italic placeholder:text-base-content/30" placeholder="Your story starts here..." />
                        </div>

                        {/* Feedback Messages */}
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`p-6 rounded-4xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-2xl ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
                                >
                                    {message.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Save Button */}
                        <motion.button
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-6 rounded-4xl bg-primary text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <FiLoader className="animate-spin text-lg" />
                            ) : (
                                <>Update Database Sync <HiSparkles className="group-hover:animate-bounce" /></>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UpdateUserProfile;