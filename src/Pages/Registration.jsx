import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../Providers/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaLink, FaEye, FaEyeSlash, FaArrowRight, FaUndo } from "react-icons/fa";

// ---------- Registration Form Component ----------
const RegistrationForm = () => {
    const { Register } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            name: "",
            email: "",
            photoUrl: "",
            password: "",
            role: "student",
        },
    });

    const [visible, setVisible] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const photoPreview = watch("photoUrl");

    const showInlineError = (msg) => {
        setFeedback({ type: "error", message: msg });
        setTimeout(() => setFeedback(null), 4000);
    };

    const onSubmit = async (data) => {
        setFeedback(null);
        try {
            const res = await Register(data.email, data.password);
            await updateProfile(res.user, {
                displayName: data.name || undefined,
                photoURL: data.photoUrl || undefined,
            });

            const userPayload = {
                name: data.name,
                email: data.email,
                photoURL: data.photoUrl || null,
                role: "student",
            };

            try {
                await axiosSecure.post("/users", userPayload);
            } catch (postErr) {
                console.error("Failed to save user to server:", postErr);
                showInlineError("Profile save failed, but account created.");
            }

            setFeedback({ type: "success", message: "Registration Complete!" });
            reset();
            setTimeout(() => navigate("/"), 1600);
        } catch (err) {
            showInlineError(err?.message || "Registration failed");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#020617]">

            {/* --- Animated Mesh Gradient Background --- */}
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 0% 0%, #020617 0%, #0f172a 50%, #1e1b4b 100%)",
                        "radial-gradient(circle at 100% 100%, #020617 0%, #0f172a 50%, #1e1b4b 100%)",
                        "radial-gradient(circle at 0% 100%, #020617 0%, #0f172a 50%, #1e1b4b 100%)",
                    ],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 -z-20"
            />

            {/* --- Glassy Form Container --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full sm:w-[90%] md:w-[85%] lg:w-[800px] bg-white/[0.03] backdrop-blur-[50px] border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Side: Branding & Info */}
                    <div className="w-full lg:w-1/3 flex flex-col justify-center text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-10">
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">
                            Join <span className="text-indigo-400 block">Registry</span>
                        </h2>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em] mt-3">Start your journey today</p>

                        {/* Photo Preview in Side Panel */}
                        {photoPreview && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-8 hidden lg:block">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/30 mx-auto lg:mx-0 shadow-lg shadow-indigo-500/10">
                                    <img
                                        src={photoPreview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=User")}
                                    />
                                </div>
                                <p className="text-[9px] text-indigo-400 mt-2 font-black uppercase tracking-widest">Identity Preview</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Side: Form Inputs */}
                    <div className="w-full lg:w-2/3">
                        {/* Feedback Message */}
                        {feedback && (
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className={`mb-6 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center ${feedback.type === "error" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"}`}
                            >
                                {feedback.message}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="relative group md:col-span-2">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    {...register("name", { required: "Name required" })}
                                    placeholder="FULL NAME"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-xs focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-semibold"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                                <input
                                    type="email"
                                    {...register("email", { required: "Required", pattern: /\S+@\S+\.\S+/ })}
                                    placeholder="AUTH EMAIL"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-xs focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-semibold"
                                />
                            </div>

                            {/* Photo URL */}
                            <div className="relative group">
                                <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                                <input
                                    {...register("photoUrl")}
                                    placeholder="PHOTO URL"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-xs focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-semibold"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group md:col-span-2">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                                <input
                                    type={visible ? "text" : "password"}
                                    {...register("password", { required: "Required", minLength: 8 })}
                                    placeholder="CREATE PASSCODE (MIN 8 CHARS)"
                                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-xs focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-semibold"
                                />
                                <button type="button" onClick={() => setVisible(!visible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                    {visible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>

                            {/* Submit & Reset */}
                            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                                >
                                    {isSubmitting ? "Initialising..." : <>Create Profile <FaArrowRight /></>}
                                </motion.button>

                                <motion.button
                                    type="button"
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                                    onClick={() => reset()}
                                    className="px-6 py-3 bg-white/5 border border-white/10 text-slate-400 font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] transition-all"
                                >
                                    <FaUndo size={10} /> Reset
                                </motion.button>
                            </div>
                        </form>

                        <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-8">
                            Already in Network?{" "}
                            <Link to="/login" className="text-indigo-400 hover:underline italic ml-1">Login Portal</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegistrationForm;