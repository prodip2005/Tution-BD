import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const InfoCard = ({ label, value }) => (
    <motion.div
        whileHover={{ scale: 1.03 }}
        className="p-4 rounded-xl bg-gray-50 border"
    >
        <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
        <p className="font-semibold text-gray-800">
            {value || "Not provided"}
        </p>
    </motion.div>
);

const TutorDetails = () => {
    const { email } = useParams();
    const axiosSecure = useAxiosSecure();

    const decodedEmail = decodeURIComponent(email);

    const { data, isLoading } = useQuery({
        queryKey: ["tutor-details", decodedEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${decodedEmail}`);
            return res.data.user;
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading tutor details...</p>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto px-4 py-10"
        >
            <div className="bg-white shadow-2xl rounded-2xl p-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={
                            data?.image ||
                            data?.photoURL ||
                            "https://placehold.co/140x140?text=Tutor"
                        }
                        alt="Tutor"
                        className="w-36 h-36 rounded-full object-cover border-4 border-indigo-600 mb-4"
                    />

                    <h2 className="text-3xl font-bold">{data?.name}</h2>
                    <p className="text-gray-500">{data?.email}</p>

                    <span className="mt-2 px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        {data?.role || "Tutor"}
                    </span>
                </div>

                {/* About */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8"
                >
                    <h3 className="text-lg font-semibold mb-2">About Tutor</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {data?.bio || "No bio added yet."}
                    </p>
                </motion.div>

                {/* Info Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InfoCard label="Subjects" value={data?.subjects} />
                    <InfoCard label="Institution" value={data?.institution} />
                    <InfoCard label="Education Level" value={data?.level} />
                    <InfoCard label="Location" value={data?.location} />
                    <InfoCard label="Phone" value={data?.phone} />
                    <InfoCard
                        label="Joined At"
                        value={
                            data?.createAt
                                ? new Date(data.createAt).toLocaleDateString()
                                : "N/A"
                        }
                    />
                </div>

                {/* Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 text-center"
                >
                    <button
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full
                        hover:bg-indigo-700 transition shadow-md"
                    >
                        Contact Tutor
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TutorDetails;
