import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AppliedTutor = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTutors = async () => {
        try {
            const res = await axios.get(
                'http://localhost:3000/tutors?status=pending'
            );
            setTutors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    const handleAction = async (id, status) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: `You want to ${status} this tutor`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axios.patch(
                `http://localhost:3000/tutors/admin-approval/${id}`,
                { status }
            );

            if (res.data.success) {
                Swal.fire(
                    'Success',
                    `Tutor ${status} successfully`,
                    'success'
                );
                fetchTutors();
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Tutor Applications
            </h1>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Institution</th>
                            <th>Subject</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tutors.map((tutor, index) => (
                            <tr key={tutor._id}>
                                <td>{index + 1}</td>
                                <td>{tutor.name}</td>
                                <td>{tutor.email}</td>
                                <td>{tutor.institution}</td>
                                <td>{tutor.subject}</td>
                                <td>{tutor.location}</td>
                                <td>
                                    <span className="badge badge-warning">
                                        {tutor.status}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleAction(tutor._id, 'approved')
                                        }
                                        className="btn btn-xs btn-success"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleAction(tutor._id, 'rejected')
                                        }
                                        className="btn btn-xs btn-error"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {tutors.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-6">
                                    No pending tutor applications
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppliedTutor;
