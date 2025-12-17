import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";

const My_Tuitions = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [editTuition, setEditTuition] = useState(null);

    const { data: myTuitions = [], refetch } = useQuery({
        queryKey: ["my-tuitions", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/tuitions?email=${user.email}`
            );
            return res.data || [];
        },
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This tuition will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(
            `/tuitions/${id}?email=${user.email}`
        );

        if (res.data.success) {
            Swal.fire("Deleted!", "", "success");
            refetch();
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedData = {
            subject: form.subject.value,
            class: form.class.value,
            location: form.location.value,
            budget: form.budget.value,
            email: user.email,
        };

        const res = await axiosSecure.put(
            `/tuitions/${editTuition._id}`,
            updatedData
        );

        if (res.data.success) {
            Swal.fire("Updated!", "", "success");
            setEditTuition(null);
            refetch();
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-6 text-center">
                📌 My Tuitions
            </h2>

            <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                <table className="table w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Location</th>
                            <th>Budget</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {myTuitions.map((t, i) => (
                            <tr key={t._id}>
                                <td>{i + 1}</td>
                                <td>{t.subject}</td>
                                <td>{t.class}</td>
                                <td>{t.location}</td>
                                <td>৳ {t.budget}</td>

                                {/* STATUS */}
                                <td>
                                    <span
                                        className={`badge ${t.status === "booked"
                                            ? "badge-success"
                                            : "badge-warning"
                                            }`}
                                    >
                                        {t.status}
                                    </span>
                                </td>

                                {/* ACTION */}
                                <td>
                                    <button
                                        disabled={t.status === "booked"}
                                        className="btn btn-xs btn-warning mr-2"
                                        onClick={() => setEditTuition(t)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        disabled={t.status === "booked"}
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleDelete(t._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {myTuitions.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-6">
                                    No tuitions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= EDIT MODAL ================= */}
            {editTuition && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h3 className="text-xl font-bold mb-4">
                            Edit Tuition
                        </h3>

                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <input
                                name="subject"
                                defaultValue={editTuition.subject}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="class"
                                defaultValue={editTuition.class}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="location"
                                defaultValue={editTuition.location}
                                className="input input-bordered w-full"
                            />
                            <input
                                name="budget"
                                defaultValue={editTuition.budget}
                                className="input input-bordered w-full"
                            />

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditTuition(null)}
                                    className="btn btn-sm"
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-sm btn-primary">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default My_Tuitions;