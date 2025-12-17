import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ApplyTution = () => {
    const axiosSecure = useAxiosSecure();

    // 🔹 pending tuitions
    const { data: tuitions = [], refetch, isLoading } = useQuery({
        queryKey: ["pending-tuitions"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/tuitions/admin/pending"
            );
            return res.data || [];
        },
    });

    const handleAction = async (id, tuition_status) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `Mark as ${tuition_status}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(
            `/tuitions/admin/review/${id}`,
            { tuition_status }
        );

        if (res.data.success) {
            Swal.fire("Done", `Tuition ${tuition_status}`, "success");
            refetch();
        }
    };

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center mb-6">
                Pending Tuitions
            </h2>

            <div className="overflow-x-auto bg-white shadow rounded">
                <table className="table w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Location</th>
                            <th>Budget</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tuitions.map((t, i) => (
                            <tr key={t._id}>
                                <td>{i + 1}</td>
                                <td>{t.subject}</td>
                                <td>{t.class}</td>
                                <td>{t.location}</td>
                                <td>৳ {t.budget}</td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleAction(t._id, "approved")
                                        }
                                        className="btn btn-xs btn-success"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleAction(t._id, "rejected")
                                        }
                                        className="btn btn-xs btn-error"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {tuitions.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-6">
                                    No pending tuitions
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplyTution;