import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Tutors = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: tutors = [], isLoading } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users?role=tutor");
            return res.data.users || [];
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading tutors...</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6 text-center"
            >
                👨‍🏫 Our Tutors
            </motion.h2>

            <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                <table className="table w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th>#</th>
                            <th>Tutor</th>
                            <th>Email</th>
                            <th>Institution</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tutors.map((tutor, index) => (
                            <motion.tr
                                key={tutor._id}
                                whileHover={{ scale: 1.01 }}
                                className="hover:bg-indigo-50"
                            >
                                <td>{index + 1}</td>

                                <td className="flex items-center gap-3">
                                    <img
                                        src={
                                            tutor.image ||
                                            "https://i.ibb.co/2FsfXqM/avatar.png"
                                        }
                                        alt="tutor"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <span className="font-semibold">
                                        {tutor.name || "Unnamed"}
                                    </span>
                                </td>

                                <td>{tutor.email}</td>

                                <td
                                    className={
                                        tutor.institution
                                            ? "text-gray-800"
                                            : "text-red-500 font-semibold"
                                    }
                                >
                                    {tutor.institution || "Not Added"}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            navigate(`/tutors/${tutor.email}`)
                                        }
                                        className="btn btn-xs btn-info flex items-center gap-1"
                                    >
                                        <FaEye /> Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}

                        {tutors.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-6"
                                >
                                    No tutors found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tutors;
