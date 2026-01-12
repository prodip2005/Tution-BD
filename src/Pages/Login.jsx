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
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        defaultValues: { email: "", password: "" },
    });

    const saveUserToDB = async (userObj) => {
        try {
            const res = await fetch("https://tutor-owl.vercel.app/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userObj),
            });
            return await res.json();
        } catch (err) {
            // console.error("Save user error:", err);
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
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-base-100 dark:bg-gray-950">

            {/* --- Animated Background --- */}
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 0% 0%, rgba(var(--p), 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 100%, rgba(var(--s), 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 0% 100%, rgba(var(--a), 0.15) 0%, transparent 50%)",
                    ],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 -z-20 bg-base-100 dark:bg-gray-950"
            />

            {/* --- Form Container (Improved Width & Glass Effect) --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full sm:w-[90%] md:w-[80%] lg:w-[650px] bg-base-100/60 dark:bg-base-200/40 backdrop-blur-[50px] border border-base-200 dark:border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
            >
                <div className="flex flex-col md:flex-row items-center gap-6">

                    {/* Left Side: Header & Animation */}
                    <div className="w-full md:w-1/3 text-center md:text-left border-b md:border-b-0 md:border-r border-base-200 dark:border-white/10 pb-4 md:pb-0 md:pr-6">
                        <div className="w-20 h-20 mx-auto md:mx-0 mb-2">
                            <Lottie animationData={null} path={loginLottie} loop={true} />
                        </div>
                        <h2 className="text-2xl font-black text-base-content italic tracking-tighter uppercase leading-tight">
                            Portal <span className="text-primary block">Login</span>
                        </h2>
                        <p className="text-[9px] uppercase font-bold text-base-content/60 tracking-[0.3em] mt-2">Security Node</p>
                    </div>

                    {/* Right Side: Form Fields */}
                    <div className="w-full md:w-2/3">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    placeholder="EMAIL ADDRESS"
                                    {...register("email", { required: "Required", pattern: /\S+@\S+\.\S+/ })}
                                    className="w-full pl-11 pr-4 py-3 bg-base-200/50 dark:bg-white/5 border border-base-300 dark:border-white/10 rounded-xl outline-none text-base-content text-xs focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-base-content/40 font-medium"
                                />
                            </div>

                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={visible ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password", { required: "Required", minLength: 6 })}
                                    className="w-full pl-11 pr-12 py-3 bg-base-200/50 dark:bg-white/5 border border-base-300 dark:border-white/10 rounded-xl outline-none text-base-content text-xs focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-base-content/40 font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setVisible(!visible)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                >
                                    {visible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className="w-full py-3 btn btn-primary font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 border-none text-primary-content"
                            >
                                {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : <>Login Now <FaArrowRight /></>}
                            </motion.button>
                        </form>

                        <div className="relative flex items-center gap-3 my-4">
                            <div className="h-px flex-1 bg-base-300 dark:bg-white/10"></div>
                            <span className="text-[9px] text-base-content/50 font-black">OR</span>
                            <div className="h-px flex-1 bg-base-300 dark:bg-white/10"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <motion.button
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                                onClick={handleGoogleLogin}
                                className="w-full py-3 bg-base-200/50 dark:bg-white/5 border border-base-300 dark:border-white/10 text-base-content/70 font-bold rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] transition-all hover:bg-base-200 dark:hover:bg-white/10"
                            >
                                <FaGoogle className="text-primary" /> Google Auth
                            </motion.button>
                        </div>

                        {/* Demo Credentials */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setValue("email", "student@demo.com");
                                    setValue("password", "123456");
                                }}
                                className="w-full py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all"
                            >
                                Demo Student
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setValue("email", "tutor@demo.com");
                                    setValue("password", "123456");
                                }}
                                className="w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                            >
                                Demo Tutor
                            </button>
                        </div>

                        <p className="text-center text-base-content/50 text-[9px] font-bold uppercase tracking-widest mt-4">
                            New here? <Link to="/register" className="text-primary hover:underline italic ml-1">Create Identity</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginForm;