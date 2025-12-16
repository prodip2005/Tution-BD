import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Providers/AuthContext';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ApplyTutor = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    // 🔎 Check existing tutor application
    useEffect(() => {
        if (!user?.email) return;

        axiosSecure.get(`/tutors/check/${user.email}`)
            .then(res => {
                if (res.data.applied) {
                    setAlreadyApplied(true);
                    setTutorData(res.data.tutor);

                    // ✅ pending হলে form prefill
                    if (res.data.tutor.status === 'pending') {
                        Object.keys(res.data.tutor).forEach(key => {
                            setValue(key, res.data.tutor[key]);
                        });
                    }
                }
            })
            .finally(() => setLoading(false));
    }, [user, axiosSecure, setValue]);

    const onSubmit = (data) => {
        data.email = user.email;

        // ✏️ UPDATE
        if (alreadyApplied && tutorData?.status === 'pending') {
            axiosSecure.patch(`/tutors/${tutorData._id}`, data)
                .then(res => {
                    console.log('UPDATE RES:', res.data);

                    if (res.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Updated',
                            text: 'Application updated successfully'
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Update failed',
                            text: res.data.message || 'Something went wrong'
                        });
                    }
                })
                .catch(err => {
                    console.error('UPDATE ERROR:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Request failed'
                    });
                });
        }

        // 🆕 FIRST APPLY
        else {
            axiosSecure.post('/tutors', data)
                .then(res => {
                    console.log('APPLY RES:', res.data);

                    if (res.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Application Submitted',
                            text: 'Please wait for admin approval'
                        });
                        setAlreadyApplied(true);
                        setTutorData({ ...data, status: 'pending' });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Apply failed',
                            text: res.data.message
                        });
                    }
                })
                .catch(err => {
                    console.error('APPLY ERROR:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Request failed'
                    });
                });
        }
    };


    if (loading) {
        return <p className="text-center mt-20">Loading...</p>;
    }

    // 🚫 Already applied & not pending
    if (alreadyApplied && tutorData?.status !== 'pending') {
        return (
            <div className="max-w-xl mx-auto mt-20 text-center">
                <h2 className="text-2xl font-bold text-warning mb-3">
                    Already Applied as Tutor
                </h2>
                <p className="text-gray-600">
                    Current Status:
                    <span className="font-semibold ml-1 capitalize">
                        {tutorData.status}
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">
                {alreadyApplied ? 'Update Tutor Application' : 'Apply as a Tutor'}
            </h1>

            <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
                {/* Name */}
                <div>
                    <label className="label">Full Name</label>
                    <input
                        {...register('name', { required: 'Name required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="label">Email</label>
                    <input
                        readOnly
                        {...register('email')}
                        value={user.email}
                        className="input input-bordered w-full bg-gray-100"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="label">Phone</label>
                    <input
                        {...register('phone', { required: 'Phone required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                {/* Age */}
                <div>
                    <label className="label">Age</label>
                    <input
                        type="number"
                        {...register('age', { required: 'Age required' })}
                        className="input input-bordered w-full"
                    />
                    {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
                </div>

                {/* Institution */}
                <div className="md:col-span-2">
                    <label className="label">College / University</label>
                    <input
                        {...register('institution', { required: 'Institution required' })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Subject */}
                <div>
                    <label className="label">Subject</label>
                    <input
                        {...register('subject', { required: 'Subject required' })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Experience */}
                <div>
                    <label className="label">Experience</label>
                    <select
                        {...register('experience', { required: true })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select</option>
                        <option value="0-1">0-1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3+">3+ years</option>
                    </select>
                </div>

                {/* Availability */}
                <div>
                    <label className="label">Availability</label>
                    <input
                        {...register('availability', { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="label">Location</label>
                    <input
                        {...register('location', { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Level */}
                <div>
                    <label className="label">Preferred Level</label>
                    <select
                        {...register('level', { required: true })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select</option>
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                        <option value="HSC">HSC</option>
                        <option value="University">University</option>
                    </select>
                </div>

                {/* About */}
                <div className="md:col-span-2">
                    <label className="label">About (Optional)</label>
                    <textarea
                        {...register('about')}
                        className="textarea textarea-bordered w-full h-28"
                    />
                </div>

                <div className="md:col-span-2">
                    <button className="btn btn-primary w-full">
                        {alreadyApplied ? 'Update Application' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyTutor;
