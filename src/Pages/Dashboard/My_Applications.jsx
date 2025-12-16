import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";

const My_Applications = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [editApp, setEditApp] = useState(null);

    const { data = [], refetch } = useQuery({
        queryKey: ["my-applications", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/applications?email=${user.email}`
            );
            return res.data;
        },
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;

        const res = await axiosSecure.put(
            `/applications/${editApp._id}`,
            {
                tutorEmail: user.email,
                qualifications: form.qualifications.value,
                experience: form.experience.value,
                expectedSalary: form.salary.value,
            }
        );

        if (res.data.success) {
            alert("Updated");
            setEditApp(null);
            refetch();
        }
    };

    const handleDelete = async (id) => {
        const res = await axiosSecure.delete(
            `/applications/${id}?email=${user.email}`
        );
        if (res.data.success) {
            refetch();
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📥 My Applications</h2>

            <table className="table w-full">
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        <th>Student</th>
                        <th>Student Email</th>
                        <th>Subject</th>
                        <th>Salary</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>


                <tbody>
                    {data.map((app) => (
                        <tr key={app._id}>
                            <td>{app.studentName || "N/A"}</td>
                            <td className="text-sm">{app.studentEmail}</td>
                            <td>{app.tuitionSubject}</td>
                            <td>৳ {app.expectedSalary}</td>
                            <td>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold
        ${app.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : app.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {app.status}
                                </span>
                            </td>

                            <td>
                                {app.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => setEditApp(app)}
                                            className="btn btn-sm btn-warning mr-2"
                                        >
                                            Edit
                                        </button>
                                        
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(app._id)}
                                    className="btn btn-sm btn-error"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            {/* EDIT MODAL */}
            {editApp && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <input
                                name="qualifications"
                                defaultValue={editApp.qualifications}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="experience"
                                defaultValue={editApp.experience}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="salary"
                                defaultValue={editApp.expectedSalary}
                                className="input input-bordered w-full"
                            />

                            <button className="btn btn-primary w-full">
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default My_Applications;
