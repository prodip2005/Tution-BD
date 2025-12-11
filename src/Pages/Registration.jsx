// src/components/RegistrationForm.jsx
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../Providers/AuthContext"; // adjust path if needed

// ---------- Animated SweetAlert-like component ----------
const AnimatedAlert = ({ title = "Success!", message, onClose, type = "success" }) => {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-sm px-6 py-6 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl text-center">
                <div className="flex flex-col items-center gap-3">
                    {type === "success" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}

                    <h3 className={`text-lg font-semibold ${type === "success" ? "text-green-700" : "text-red-700"}`}>{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>

                    <button
                        onClick={onClose}
                        className={`mt-4 px-5 py-2 rounded-lg text-white transition ${type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        OK
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes sweetPop {
          0% { transform: scale(.7); opacity: 0 }
          60% { transform: scale(1.05); opacity: 1 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-sweet { animation: sweetPop 420ms cubic-bezier(.2,1.1,.3,1); }
        /* give card the animation class */
        .fixed > .w-full > div { animation: sweetPop 420ms cubic-bezier(.2,1.1,.3,1); }
      `}</style>
        </div>
    );
};

// ---------- Main Registration Form ----------
const RegistrationForm = () => {
    const { Register } = useContext(AuthContext); // <-- make sure AuthProvider provides Register()
    const navigate = useNavigate();

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
        },
    });

    const [visible, setVisible] = useState(false);
    const [feedback, setFeedback] = useState(null); // inline small feedback (error messages)
    const [successPopup, setSuccessPopup] = useState(null); // {message} or null

    const photoPreview = watch("photoUrl");

    const showInlineError = (msg) => {
        setFeedback({ type: "error", message: msg });
        setTimeout(() => setFeedback(null), 3000);
    };

    const onSubmit = async (data) => {
        setFeedback(null);
        try {
            // 1) create user
            const res = await Register(data.email, data.password);
            // 2) update profile
            await updateProfile(res.user, {
                displayName: data.name || undefined,
                photoURL: data.photoUrl || undefined,
            });

            // 3) show animated sweetalert-like popup, then redirect
            setSuccessPopup({ message: "Registration complete — welcome!" });

            reset();

            // auto-close & redirect after 1.8s if user doesn't click OK
            setTimeout(() => {
                setSuccessPopup(null);
                navigate("/"); // change path if needed
            }, 1800);
        } catch (err) {
            console.error("Registration error:", err);
            // Better friendly message extraction
            const msg = err?.message || "Registration failed";
            showInlineError(msg);
        }
    };

    return (
        <div className="form-container max-w-md mx-auto p-6 relative">
            {/* Animated popup */}
            {successPopup && (
                <AnimatedAlert
                    title="Success!"
                    type="success"
                    message={successPopup.message}
                    onClose={() => {
                        setSuccessPopup(null);
                        navigate("/dashboard");
                    }}
                />
            )}

            {/* small inline feedback near top */}
            {feedback && (
                <div className={`mb-4 px-4 py-2 rounded ${feedback.type === "error" ? "bg-red-50 text-red-800 border border-red-100" : "bg-green-50 text-green-800"}`}>
                    {feedback.message}
                </div>
            )}

            {/* Form header */}
            <h2 className="form-title text-2xl font-bold mb-1">Create Account</h2>
            <p className="form-subtitle text-sm text-gray-600 mb-6">Join our community!</p>

            <form onSubmit={handleSubmit(onSubmit)} className="registration-form space-y-4">
                {/* Name */}
                <div className="input-group">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <input
                        id="name"
                        {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
                        placeholder="Enter your full name"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.name ? "border-red-400" : "border-gray-300"}`}
                        autoComplete="name"
                        aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="input-group">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Please enter a valid email" } })}
                        placeholder="you@example.com"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.email ? "border-red-400" : "border-gray-300"}`}
                        autoComplete="email"
                        aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Photo URL */}
                <div className="input-group">
                    <label htmlFor="photoUrl" className="block text-sm font-medium mb-1">Photo URL (optional)</label>
                    <input
                        id="photoUrl"
                        {...register("photoUrl", { pattern: { value: /^(https?:\/\/.+)/i, message: "Please enter a valid URL" } })}
                        placeholder="https://example.com/photo.jpg"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.photoUrl ? "border-red-400" : "border-gray-300"}`}
                        autoComplete="photo"
                        aria-invalid={errors.photoUrl ? "true" : "false"}
                    />
                    {errors.photoUrl && <p className="text-red-500 text-sm mt-1">{errors.photoUrl.message}</p>}

                    {photoPreview && (
                        <div className="mt-3 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border">
                                <img
                                    src={photoPreview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = "https://placehold.co/80x80?text=No+Image")}
                                />
                            </div>
                            <p className="text-sm text-gray-600">Preview</p>
                        </div>
                    )}
                </div>

                {/* Password */}
                <div className="input-group relative">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                        id="password"
                        type={visible ? "text" : "password"}
                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                        placeholder="Must be at least 8 characters"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none pr-10 ${errors.password ? "border-red-400" : "border-gray-300"}`}
                        autoComplete="new-password"
                        aria-invalid={errors.password ? "true" : "false"}
                    />
                    <button type="button" onClick={() => setVisible((v) => !v)} className="absolute right-2 top-9 p-1 rounded text-gray-600" aria-label={visible ? "Hide password" : "Show password"}>
                        {visible ? "Hide" : "Show"}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button type="submit" disabled={isSubmitting} className={`submit-button w-full px-4 py-2 rounded-md font-medium text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`} aria-busy={isSubmitting}>
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>

                    <button type="button" onClick={() => { reset(); setFeedback(null); }} className="w-full px-4 py-2 rounded-md border text-sm">
                        Reset
                    </button>
                </div>
            </form>

            <p className="login-prompt text-sm text-center mt-4">
                Already registered? Please{" "}
                <a href="/login" className="login-link text-blue-600 hover:underline">Login</a>
            </p>

            {/* small inline animation for popup (if any additional polish needed) */}
            <style>{`
        @keyframes popFade {
          0% { transform: translateY(-8px) scale(0.96); opacity: 0; }
          60% { transform: translateY(0) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-feedback { animation: popFade 360ms cubic-bezier(.2,.9,.3,1); }
      `}</style>
        </div>
    );
};

export default RegistrationForm;
