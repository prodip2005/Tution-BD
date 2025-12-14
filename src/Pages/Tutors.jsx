import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const Tutors = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data = [], isLoading } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const res = await axiosSecure.get("/tutors");
            return res.data.tutors;
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading tutors...</p>;
    }

    return (
        <div className="p-6">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6 text-center"
            >
                👨‍🏫 All Tutors
            </motion.h2>

            <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                <table className="table w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Institution</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((tutor, index) => (
                            <motion.tr
                                key={tutor._id}
                                whileHover={{ scale: 1.01 }}
                                className="hover:bg-indigo-50"
                            >
                                <td>{index + 1}</td>
                                <td className="font-semibold">{tutor.name}</td>
                                <td
                                    className={
                                        tutor?.institution
                                            ? "text-gray-800"
                                            : "text-red-500 font-semibold"
                                    }
                                >
                                    {tutor?.institution || "Not Added"}
                                </td>

                                <td>
                                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                                        Tutor
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/tutors/${tutor.email}`)}
                                        className="px-4 py-1 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                                    >
                                        Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tutors;
