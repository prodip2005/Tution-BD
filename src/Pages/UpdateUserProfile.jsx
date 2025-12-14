import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../Providers/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { auth } from "../Firebase/firebase.init";

const roles = [
    { value: "student", label: "Student" },
    { value: "tutor", label: "Tutor" },
];

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
    } = useForm({
        defaultValues: {
            name: "",
            role: "",
            imageUrl: "",
            subjects: "",
            institution: "",
            level: "",
            location: "",
            phone: "",
            bio: "",
        },
    });

    /* ---------------- Load user from DB ---------------- */
    useEffect(() => {
        if (!user?.email) return;

        const loadUser = async () => {
            try {
                const res = await axiosSecure.get(
                    `/users/${encodeURIComponent(user.email.toLowerCase())}`
                );

                if (res.data?.success) {
                    const dbUser = res.data.user;

                    setValue("name", dbUser.name || user.displayName || "");
                    setValue("role", dbUser.role || "student");
                    setValue("subjects", dbUser.subjects || "");
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
                console.error("User load failed:", err);
            }
        };

        loadUser();
    }, [user, axiosSecure, setValue]);

    /* ---------------- Submit ---------------- */
    const onSubmit = async (data) => {
        setLoading(true);
        setMessage(null);

        try {
            const payload = {
                email: user.email,
                name: data.name,
                role: data.role,
                image: data.imageUrl,
                subjects: data.subjects,
                institution: data.institution,
                level: data.level,
                location: data.location,
                phone: data.phone,
                bio: data.bio,
            };

            const res = await axiosSecure.put("/users/profile", payload);

            if (!res.data.success) throw new Error("DB update failed");

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: data.name,
                    photoURL: data.imageUrl,
                });
            }

            setMessage({ type: "success", text: "Profile updated successfully 🎉" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* Preview */}
                <div className="flex flex-col items-center">
                    <div className="w-44 h-44 rounded-full overflow-hidden border-4 shadow">
                        {preview ? (
                            <img src={preview} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>

                    <h3 className="mt-4 text-xl font-semibold">
                        {watch("name") || "Your Name"}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>

                    <span className="mt-2 px-4 py-1 rounded-full bg-indigo-600 text-white text-sm">
                        {watch("role")}
                    </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h2 className="text-2xl font-bold">Update Profile</h2>

                    <input
                        {...register("name", { required: true })}
                        placeholder="Full Name"
                        className="input input-bordered w-full"
                    />

                    <select {...register("role")} className="input input-bordered w-full">
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>

                    <input
                        {...register("imageUrl")}
                        onChange={(e) => setPreview(e.target.value)}
                        placeholder="Profile Image URL"
                        className="input input-bordered w-full"
                    />

                    <input
                        {...register("subjects")}
                        placeholder="Subjects (Math, Physics)"
                        className="input input-bordered w-full"
                    />

                    <input
                        {...register("institution")}
                        placeholder="School / College / University"
                        className="input input-bordered w-full"
                    />

                    <input
                        {...register("level")}
                        placeholder="Class / Level"
                        className="input input-bordered w-full"
                    />

                    <input
                        {...register("location")}
                        placeholder="Location"
                        className="input input-bordered w-full"
                    />

                    <input
                        {...register("phone")}
                        placeholder="Phone Number"
                        className="input input-bordered w-full"
                    />

                    <textarea
                        {...register("bio")}
                        rows={3}
                        placeholder="About you"
                        className="textarea textarea-bordered w-full"
                    />

                    {message && (
                        <p
                            className={`text-sm ${message.type === "success"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {message.text}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateUserProfile;
