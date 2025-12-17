// src/components/LoginForm.jsx
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Providers/AuthContext"; // তোমার প্রজেক্ট অনুযায়ী path ঠিক করো
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const LoginForm = () => {
    const navigate = useNavigate();
    const { SignIn, GoogleSignIn } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [visible, setVisible] = useState(false);

    // ব্যাকএন্ডে ইউজার সেভ করার ফাংশন
    const saveUserToDB = async (userObj) => {
        try {
            const res = await fetch("https://tutor-owl.vercel.app/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userObj),
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Save user error:", err);
            return null;
        }
    };

    // Email/password login
    const onSubmit = async (formData) => {
        const { email, password } = formData;
        try {
            const result = await SignIn(email, password);
            const loggedUser = result.user;

            // Save to DB (if you want to update/create user record)
            await saveUserToDB({
                name: loggedUser.displayName || "No name",
                email: loggedUser.email,
                image: loggedUser.photoURL || "",
            });

            await Swal.fire({
                title: "Login Successful!",
                text: "Welcome back!",
                icon: "success",
                confirmButtonText: "Continue",
                confirmButtonColor: "#4f46e5",
            });

            navigate("/");
        } catch (error) {
            Swal.fire({
                title: "Login Failed",
                text: error.message,
                icon: "error",
                confirmButtonText: "Try Again",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    // Google Sign-In
    const handleGoogleLogin = async () => {
        try {
            const result = await GoogleSignIn();
            const user = result.user;

            // POST to backend to ensure user exists with default role 'student'
            await saveUserToDB({
                name: user.displayName || "No name",
                email: user.email,
                image: user.photoURL || "",
            });

            await Swal.fire({
                title: "Google Login Successful!",
                text: `Welcome ${user.displayName || "User"}!`,
                icon: "success",
                confirmButtonText: "Continue",
                confirmButtonColor: "#4f46e5",
            });

            navigate("/");
        } catch (err) {
            Swal.fire({
                title: "Google Login Failed",
                text: err.message,
                icon: "error",
                confirmButtonText: "Try Again",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2 text-center">Welcome Back</h2>
            <p className="text-sm text-center text-gray-600 mb-6">
                Please sign in to your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                        })}
                        className={`w-full px-3 py-2 rounded-md border ${errors.email ? "border-red-400" : "border-gray-300"
                            } focus:outline-none`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type={visible ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                        className={`w-full px-3 py-2 rounded-md border ${errors.password ? "border-red-400" : "border-gray-300"
                            } focus:outline-none pr-20`}
                    />
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        className="absolute right-2 top-8 text-sm px-2 py-1 rounded"
                        aria-label={visible ? "Hide password" : "Show password"}
                    >
                        {visible ? "Hide" : "Show"}
                    </button>

                    <a
                        href="/forgot-password"
                        className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
                    >
                        Forgot?
                    </a>

                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 rounded-md text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {isSubmitting ? "Signing in..." : "Log In"}
                </button>
            </form>

            <div className="my-4 flex items-center">
                <hr className="flex-1" />
                <span className="mx-3 text-sm text-gray-500">or</span>
                <hr className="flex-1" />
            </div>

            {/* Google Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full py-2 rounded-md border flex items-center justify-center gap-3 hover:bg-gray-100"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 533.5 544.3"
                    className="w-5 h-5"
                >
                    <path d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.4H272v95.2h147.3c-6.3 34.2-25 63.2-53.5 82.6v68.5h86.3c50.4-46.5 81.4-114.8 81.4-196z" />
                    <path d="M272 544.3c72.8 0 134.1-24.2 178.8-65.6l-86.3-68.5c-24.1 16.1-55 25.6-92.5 25.6-71 0-131.2-47.8-152.7-112.3H30.6v70.6C75.6 492.9 167 544.3 272 544.3z" />
                    <path d="M119.3 324.4c-11.4-34.2-11.4-71 0-105.2V148.6H30.6c-36.2 72.3-36.2 157.4 0 229.7l88.7-54z" />
                    <path d="M272 107.7c38.9-.6 76 13.8 104.3 39.8l78.6-78.6C405.8 24.6 344.5 0 272 0 167 0 75.6 51.4 30.6 148.6l88.7 70.6C140.8 155.5 201 107.7 272 107.7z" />
                </svg>
                Continue with Google
            </button>

            <p className="text-center text-sm mt-4">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                    Register Here
                </a>
            </p>
        </div>
    );
};

export default LoginForm;
