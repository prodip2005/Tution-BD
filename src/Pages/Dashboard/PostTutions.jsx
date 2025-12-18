import React, { use } from "react";
import { useForm } from "react-hook-form";
import useRole from "../../Hooks/useRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";
import { motion } from "framer-motion";
import { BookOpen, MapPin, DollarSign, Clock, MessageSquare, PlusCircle } from "lucide-react";
import Swal from "sweetalert2";

const PostTutions = () => {
    const { role, isLoading } = useRole();
    const axiosSecure = useAxiosSecure();
    const { user } = use(AuthContext);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // --- Modern Cyber Loader ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.2)]"
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
                        className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Establishing Portal
                    </motion.p>
                </div>
            </div>
        );
    }

    // --- Access Denied UI ---
    if (role !== "student") {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-12 bg-white/[0.02] backdrop-blur-3xl border border-red-500/20 rounded-[3rem] max-w-lg w-full shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                            <PlusCircle size={40} className="rotate-45" />
                        </div>
                        <h2 className="text-red-500 text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">Access <span className="text-white">Denied</span></h2>
                        <p className="text-slate-400 mt-4 font-medium leading-relaxed">
                            Only registered <span className="text-indigo-400 font-bold italic uppercase">Students</span> can publish tuition requests.
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            email: user.email,
            status: "pending",
            tuition_status: "approved",
            studentName: user.displayName,
            studentId: user._id,
            createdAt: new Date(),
        };

        try {
            const res = await axiosSecure.post("/tuitions", payload);
            if (res.data.success) {
                Swal.fire({
                    title: "Submitted!",
                    text: "Your tuition request is now live.",
                    icon: "success",
                    background: '#020617',
                    color: '#fff',
                    confirmButtonColor: "#6366f1"
                });
                reset();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error",
                background: '#020617',
                color: '#fff'
            });
        }
    };

    return (
        <div className="min-h-full py-12 px-4 md:px-0 flex justify-center items-center bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative Background Element */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-12">
                        <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-[2rem] shadow-xl">
                            <PlusCircle size={36} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                                Create <span className="text-indigo-500">Tuition</span>
                            </h2>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Find the best mentor for your journey.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Subject */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                    <BookOpen size={14} className="text-indigo-500" /> Subject Name
                                </label>
                                <input
                                    {...register("subject", { required: true })}
                                    className="w-full px-6 py-5 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-[1.5rem] outline-none text-white font-bold transition-all placeholder:text-slate-700 focus:bg-white/[0.08]"
                                    placeholder="e.g. Higher Math"
                                />
                                {errors.subject && <p className="text-red-500 text-[10px] font-bold uppercase ml-1 tracking-wider">Subject is required</p>}
                            </div>

                            {/* Class */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                    <PlusCircle size={14} className="text-indigo-500" /> Class / Level
                                </label>
                                <input
                                    {...register("class", { required: true })}
                                    className="w-full px-6 py-5 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-[1.5rem] outline-none text-white font-bold transition-all placeholder:text-slate-700 focus:bg-white/[0.08]"
                                    placeholder="e.g. Class 10 / HSC"
                                />
                                {errors.class && <p className="text-red-500 text-[10px] font-bold uppercase ml-1 tracking-wider">Class is required</p>}
                            </div>

                            {/* Location */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                    <MapPin size={14} className="text-indigo-500" /> Location
                                </label>
                                <input
                                    {...register("location", { required: true })}
                                    className="w-full px-6 py-5 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-[1.5rem] outline-none text-white font-bold transition-all placeholder:text-slate-700 focus:bg-white/[0.08]"
                                    placeholder="e.g. Mirpur, Dhaka"
                                />
                                {errors.location && <p className="text-red-500 text-[10px] font-bold uppercase ml-1 tracking-wider">Location is required</p>}
                            </div>

                            {/* Budget */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                    <DollarSign size={14} className="text-indigo-500" /> Budget (Monthly ৳)
                                </label>
                                <input
                                    type="number"
                                    {...register("budget", { required: true })}
                                    className="w-full px-6 py-5 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-[1.5rem] outline-none text-white font-bold transition-all placeholder:text-slate-700 focus:bg-white/[0.08]"
                                    placeholder="e.g. 5000"
                                />
                                {errors.budget && <p className="text-red-500 text-[10px] font-bold uppercase ml-1 tracking-wider">Budget is required</p>}
                            </div>
                        </div>

                        {/* Preferred Time */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                <Clock size={14} className="text-indigo-500" /> Preferred Time & Days
                            </label>
                            <input
                                {...register("time")}
                                className="w-full px-6 py-5 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-[1.5rem] outline-none text-white font-bold transition-all placeholder:text-slate-700 focus:bg-white/[0.08]"
                                placeholder="e.g. 4:00 PM | 3 Days per week"
                            />
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                <MessageSquare size={14} className="text-indigo-500" /> Additional Information
                            </label>
                            <textarea
                                {...register("details")}
                                className="w-full px-6 py-5 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-[1.5rem] outline-none text-white font-bold transition-all placeholder:text-slate-700 focus:bg-white/[0.08] min-h-[140px] resize-none"
                                placeholder="Describe any specific requirements (e.g. Female tutor preferred...)"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(79,70,229,0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-6 bg-indigo-600 text-white font-black rounded-[1.5rem] transition-all uppercase tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-3 mt-6 shadow-2xl"
                        >
                            Post Tuition Request <PlusCircle size={18} />
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default PostTutions;