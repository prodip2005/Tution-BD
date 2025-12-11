import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Providers/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const LoginForm = () => {
    const navigate = useNavigate();
    const { SignIn } = useContext(AuthContext);   // <-- useContext
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

    const onSubmit = (data) => {
        const { email, password } = data;

        SignIn(email, password)
            .then((result) => {
                Swal.fire({
                    title: "Login Successful!",
                    text: "Welcome back!",
                    icon: "success",
                    confirmButtonText: "Continue",
                    confirmButtonColor: "#4f46e5",
                    background: "#ffffffdd",
                    showClass: {
                        popup: "animate__animated animate__fadeInDown",
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOutUp",
                    },
                }).then(() => {
                    navigate("/"); // redirect to home
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: "Login Failed",
                    text: error.message,
                    icon: "error",
                    confirmButtonText: "Try Again",
                    confirmButtonColor: "#ef4444",
                });
            });
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Please sign in to your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
                {/* Email */}
                <div className="input-group animated-input">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                        })}
                        className={`w-full px-3 py-2 rounded-md focus:outline-none ${errors.email ? "border-red-400" : "border-gray-300"
                            }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="input-group animated-input relative">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type={visible ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                        className={`w-full px-3 py-2 rounded-md focus:outline-none pr-10 ${errors.password ? "border-red-400" : "border-gray-300"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        className="absolute right-2 top-9 p-1 rounded text-gray-600"
                    >
                        {visible ? "Hide" : "Show"}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

                    <a
                        href="/forgot-password"
                        className="forgot-password-link absolute right-2 top-2 text-sm text-blue-600 hover:underline"
                    >
                        Forgot?
                    </a>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`login-button animated-button w-full px-4 py-2 rounded-md text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {isSubmitting ? "Signing in..." : "Log In"}
                </button>
            </form>

            <p className="register-prompt text-center mt-4">
                Don't have an account?{" "}
                <a href="/register" className="register-link text-blue-600 hover:underline">
                    Register Here
                </a>
            </p>
        </div>
    );
};

export default LoginForm;
