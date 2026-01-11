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

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 md:w-32 md:h-32 border-2 border-primary/10 border-t-primary rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center"
                    >
                        <div className="w-2 h-2 bg-primary-content rounded-full" />
                    </motion.div>
                </div>
                <div className="mt-8 md:mt-12 flex flex-col items-center">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-primary text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase italic"
                    >
                        Establishing Portal
                    </motion.p>
                </div>
            </div>
        );
    }

    if (role !== "student") {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 md:p-12 bg-base-200 dark:bg-white/2 backdrop-blur-3xl border border-error/20 rounded-4xl md:rounded-[3rem] max-w-lg w-full shadow-2xl relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <PlusCircle size={32} className="rotate-45" />
                        </div>
                        <h2 className="text-error text-xl md:text-3xl font-black uppercase italic leading-none">Access <span className="text-base-content">Denied</span></h2>
                        <p className="text-base-content/60 mt-4 text-xs md:text-sm font-medium leading-relaxed">
                            Only registered <span className="text-primary font-bold italic uppercase">Students</span> can publish requests.
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
                    background: 'var(--color-base-100, #020617)',
                    color: 'var(--color-base-content, #fff)',
                    confirmButtonColor: "var(--color-primary, #6366f1)"
                });
                reset();
            }
        } catch (err) {
            Swal.fire({ title: "Error", text: "Something went wrong!", icon: "error", background: 'var(--color-base-100, #020617)', color: 'var(--color-base-content, #fff)' });
        }
    };

    return (
        <div className="min-h-full py-4 md:py-12 px-0 md:px-4 flex justify-center items-center bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                // Mobile এ rounded-none আর w-full করা হয়েছে
                className="w-full max-w-4xl bg-base-100 dark:bg-white/2 md:backdrop-blur-3xl border-y md:border border-base-200 dark:border-white/10 rounded-none md:rounded-4xl p-5 md:p-14 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-5 mb-8 md:mb-12">
                        <div className="p-4 md:p-5 bg-primary/10 border border-primary/20 text-primary rounded-2xl md:rounded-4xl">
                            <PlusCircle size={28} className="md:w-9 md:h-9" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-5xl font-black text-base-content uppercase tracking-tighter italic leading-none">
                                Create <span className="text-primary">Tuition</span>
                            </h2>
                            <p className="text-base-content/40 font-bold text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] mt-2">Find the best mentor for your journey.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-1">
                                    <BookOpen size={12} className="text-primary" /> Subject
                                </label>
                                <input
                                    {...register("subject", { required: true })}
                                    className="w-full px-5 py-4 md:px-6 md:py-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-3xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30"
                                    placeholder="e.g. Higher Math"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-1">
                                    <PlusCircle size={12} className="text-primary" /> Level
                                </label>
                                <input
                                    {...register("class", { required: true })}
                                    className="w-full px-5 py-4 md:px-6 md:py-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-3xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30"
                                    placeholder="e.g. HSC"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-1">
                                    <MapPin size={12} className="text-primary" /> Location
                                </label>
                                <input
                                    {...register("location", { required: true })}
                                    className="w-full px-5 py-4 md:px-6 md:py-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-3xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30"
                                    placeholder="e.g. Mirpur"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-1">
                                    <DollarSign size={12} className="text-primary" /> Monthly ৳
                                </label>
                                <input
                                    type="number"
                                    {...register("budget", { required: true })}
                                    className="w-full px-5 py-4 md:px-6 md:py-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-3xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30"
                                    placeholder="e.g. 5000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-1">
                                <Clock size={12} className="text-primary" /> Time & Days
                            </label>
                            <input
                                {...register("time")}
                                className="w-full px-5 py-4 md:px-6 md:py-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-3xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30"
                                placeholder="e.g. 4:00 PM | 3 Days"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-1">
                                <MessageSquare size={12} className="text-primary" /> Information
                            </label>
                            <textarea
                                {...register("details")}
                                className="w-full px-5 py-4 md:px-6 md:py-5 bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-3xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30 min-h-[100px] md:min-h-[140px] resize-none"
                                placeholder="Requirements..."
                            ></textarea>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full py-4 md:py-6 bg-primary text-white font-black rounded-xl md:rounded-3xl transition-all uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-2 md:gap-3 shadow-xl"
                        >
                            Post Request <PlusCircle size={16} />
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default PostTutions;