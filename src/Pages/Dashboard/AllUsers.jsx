import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
    FaUserShield,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaTrash,
    FaEye,
} from "react-icons/fa";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [activeRole, setActiveRole] = useState("student");
    const [selectedUser, setSelectedUser] = useState(null);

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ["all-users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data.users || [];
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading users...</p>;
    }

    const filteredUsers = users.filter(
        (user) => user.role === activeRole
    );

 
    const handleRoleChange = async (email, role) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `Change role to ${role}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(
                `/users/role/${email}`,
                { role }
            );

            if (!res.data.success) {
                Swal.fire(
                    "Blocked ❌",
                    res.data.message || "Action not allowed",
                    "error"
                );
                return;
            }

            Swal.fire("Success ✅", "Role updated", "success");
            refetch();
        } catch (err) {
            Swal.fire("Error ❌", "Failed to update role", "error");
        }
    };


    const handleDelete = async (email) => {
        const confirm = await Swal.fire({
            title: "Delete user?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/users/${email}`);

            if (!res.data.success) {
                Swal.fire(
                    "Blocked ❌",
                    res.data.message || "Cannot delete user",
                    "error"
                );
                return;
            }

            Swal.fire("Deleted ✅", "User removed", "success");
            refetch();
        } catch (err) {
            Swal.fire("Error ❌", "Delete failed", "error");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center mb-6">
                👥 Admin User Management
            </h2>

            {/* ROLE FILTER BUTTONS */}
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
                <button
                    onClick={() => setActiveRole("admin")}
                    className={`btn btn-sm ${activeRole === "admin"
                            ? "btn-error"
                            : "btn-outline"
                        }`}
                >
                    <FaUserShield /> Admin
                </button>

                <button
                    onClick={() => setActiveRole("tutor")}
                    className={`btn btn-sm ${activeRole === "tutor"
                            ? "btn-success"
                            : "btn-outline"
                        }`}
                >
                    <FaChalkboardTeacher /> Tutor
                </button>

                <button
                    onClick={() => setActiveRole("student")}
                    className={`btn btn-sm ${activeRole === "student"
                            ? "btn-primary"
                            : "btn-outline"
                        }`}
                >
                    <FaUserGraduate /> Student
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                <table className="table w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map((user, i) => (
                            <tr key={user._id}>
                                <td>{i + 1}</td>

                                <td className="flex items-center gap-3">
                                    <img
                                        src={
                                            user.image ||
                                            "https://i.ibb.co/2FsfXqM/avatar.png"
                                        }
                                        className="w-10 h-10 rounded-full"
                                        alt="user"
                                    />
                                    <span>{user.name || "Unnamed"}</span>
                                </td>

                                <td>{user.email}</td>
                                <td className="capitalize font-medium">
                                    {user.role}
                                </td>

                                <td className="text-center">
                                    <div className="flex gap-2 flex-wrap justify-center items-center">

                                        <button
                                            className="btn btn-xs btn-info"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <FaEye />
                                        </button>

                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() =>
                                                    handleRoleChange(user.email, "admin")
                                                }
                                                className="btn btn-xs btn-warning"
                                            >
                                                Make Admin
                                            </button>
                                        )}

                                        {user.role !== "tutor" && (
                                            <button
                                                onClick={() =>
                                                    handleRoleChange(user.email, "tutor")
                                                }
                                                className="btn btn-xs btn-success"
                                            >
                                                Make Tutor
                                            </button>
                                        )}

                                        {user.role !== "student" && (
                                            <button
                                                onClick={() =>
                                                    handleRoleChange(user.email, "student")
                                                }
                                                className="btn btn-xs btn-secondary"
                                            >
                                                Make Student
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(user.email)}
                                            className="btn btn-xs btn-error"
                                        >
                                            <FaTrash />
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-6"
                                >
                                    No {activeRole} found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* USER DETAILS MODAL */}
            {selectedUser && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            User Details
                        </h3>

                        <p>
                            <b>Name:</b>{" "}
                            {selectedUser.name || "N/A"}
                        </p>
                        <p>
                            <b>Email:</b> {selectedUser.email}
                        </p>
                        <p>
                            <b>Role:</b>{" "}
                            {selectedUser.role}
                        </p>
                        <p>
                            <b>Institution:</b>{" "}
                            {selectedUser.institution || "N/A"}
                        </p>
                        <p>
                            <b>Phone:</b>{" "}
                            {selectedUser.phone || "N/A"}
                        </p>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AllUsers;
