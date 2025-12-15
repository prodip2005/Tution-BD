import React, { use } from "react";
import { useForm } from "react-hook-form";
import useRole from "../../Hooks/useRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";

const PostTutions = () => {
    const { role, isLoading } = useRole();
    const axiosSecure = useAxiosSecure();
    const {user}=use(AuthContext)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    if (isLoading) return <p className="text-center">Loading...</p>;

    if (role !== "student")
        return (
            <div className="text-center mt-10 text-red-500 text-lg">
                Only students can post tuition requests.
            </div>
        );

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            email: user.email,
            status: "pending",
            studentName: user.displayName,     
            studentId: user._id,              
            createdAt: new Date(),
        };

        try {
            const res = await axiosSecure.post("/tuitions", payload);

            if (res.data.success) {
                alert("Tuition request submitted for approval!");
                reset();
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">📝 Create Tuition Post</h2>
            <p className="mb-6 text-sm text-gray-500">
                Fill out the details below to publish your tuition request.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Subject */}
                <div>
                    <label className="block mb-1 font-medium">Subject</label>
                    <input
                        {...register("subject", { required: true })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Math / Physics / English..."
                    />
                    {errors.subject && (
                        <p className="text-red-500 text-sm">Subject is required</p>
                    )}
                </div>

                {/* Class */}
                <div>
                    <label className="block mb-1 font-medium">Class</label>
                    <input
                        {...register("class", { required: true })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Class 8 / SSC / HSC..."
                    />
                    {errors.class && (
                        <p className="text-red-500 text-sm">Class is required</p>
                    )}
                </div>

                {/* Location */}
                <div>
                    <label className="block mb-1 font-medium">Location</label>
                    <input
                        {...register("location", { required: true })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Dhaka, Mirpur-10"
                    />
                    {errors.location && (
                        <p className="text-red-500 text-sm">Location is required</p>
                    )}
                </div>

                {/* Budget */}
                <div>
                    <label className="block mb-1 font-medium">Budget (৳)</label>
                    <input
                        type="number"
                        {...register("budget", { required: true })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="3000"
                    />
                    {errors.budget && (
                        <p className="text-red-500 text-sm">Budget is required</p>
                    )}
                </div>

                {/* Preferred Time */}
                <div>
                    <label className="block mb-1 font-medium">Preferred Time</label>
                    <input
                        {...register("time")}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Evening / Weekend"
                    />
                </div>

                {/* Details */}
                <div>
                    <label className="block mb-1 font-medium">Additional Details</label>
                    <textarea
                        {...register("details")}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Anything else the tutor should know?"
                        rows={3}
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Submit Tuition Request
                </button>
            </form>
        </div>
    );
};

export default PostTutions;
