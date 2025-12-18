import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Providers/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaArrowRight } from "react-icons/fa";
import Lottie from "lottie-react";

const loginLottie = "https://lottie.host/81e59267-3a13-431d-8547-49d3298c4d62/X6YxX8rS2S.json";

const LoginForm = () => {
    const navigate = useNavigate();
    const { SignIn, GoogleSignIn } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        defaultValues: { email: "", password: "" },
    });

    const saveUserToDB = async (userObj) => {
        try {
            const res = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userObj),
            });
            return await res.json();
        } catch (err) {
            console.error("Save user error:", err);
            return null;
        }
    };

    const onSubmit = async (formData) => {
        const { email, password } = formData;
        try {
            const result = await SignIn(email, password);
            await saveUserToDB({
                name: result.user.displayName || "No name",
                email: result.user.email,
                image: result.user.photoURL || "",
            });
            Swal.fire({ title: "Authorized!", icon: "success", background: "#0a0a0a", color: "#fff", confirmButtonColor: "#6366f1" });
            navigate("/");
        } catch (error) {
            Swal.fire({ title: "Access Denied", text: error.message, icon: "error", background: "#0a0a0a", color: "#fff" });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await GoogleSignIn();
            await saveUserToDB({
                name: result.user.displayName || "No name",
                email: result.user.email,
                image: result.user.photoURL || "",
            });
            Swal.fire({ title: "Google Sync Success!", icon: "success", background: "#0a0a0a", color: "#fff" });
            navigate("/");
        } catch (err) {
            Swal.fire({ title: "Failed", text: err.message, icon: "error" });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#020617]">

            {/* --- Animated Background --- */}
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

            {/* --- Form Container (Improved Width & Glass Effect) --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                // Width বাড়ানো হয়েছে (max-w-[650px]) এবং Height কমানোর জন্য padding adjust করা হয়েছে
                className="w-full sm:w-[90%] md:w-[80%] lg:w-[650px] bg-white/[0.03] backdrop-blur-[50px] border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] border-t-white/20 border-l-white/20"
            >
                <div className="flex flex-col md:flex-row items-center gap-6">

                    {/* Left Side: Header & Animation */}
                    <div className="w-full md:w-1/3 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                        <div className="w-20 h-20 mx-auto md:mx-0 mb-2">
                            <Lottie animationData={null} path={loginLottie} loop={true} />
                        </div>
                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">
                            Portal <span className="text-indigo-400 block">Login</span>
                        </h2>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-[0.3em] mt-2">Security Node</p>
                    </div>

                    {/* Right Side: Form Fields */}
                    <div className="w-full md:w-2/3">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                                <input
                                    type="email"
                                    placeholder="EMAIL ADDRESS"
                                    {...register("email", { required: "Required", pattern: /\S+@\S+\.\S+/ })}
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-xs focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                                <input
                                    type={visible ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password", { required: "Required", minLength: 6 })}
                                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-xs focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setVisible(!visible)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    {visible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>

                            <div className="flex justify-end">
                                <Link to="/forgot-password" size={10} className="text-[9px] text-slate-500 uppercase font-black hover:text-indigo-400 tracking-widest transition-colors">Forgot Access?</Link>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                            >
                                {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : <>Login Now <FaArrowRight /></>}
                            </motion.button>
                        </form>

                        <div className="relative flex items-center gap-3 my-4">
                            <div className="h-[1px] flex-1 bg-white/5"></div>
                            <span className="text-[9px] text-slate-600 font-black">OR</span>
                            <div className="h-[1px] flex-1 bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <motion.button
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                                onClick={handleGoogleLogin}
                                className="w-full py-3 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] transition-all"
                            >
                                <FaGoogle className="text-indigo-400" /> Google Auth
                            </motion.button>
                        </div>

                        <p className="text-center text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-4">
                            New here? <Link to="/register" className="text-indigo-400 hover:underline italic ml-1">Create Identity</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginForm;