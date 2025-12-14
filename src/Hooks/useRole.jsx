import React, { use } from 'react';
import { AuthContext } from '../Providers/AuthContext';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';


const useRole = () => {

    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const {data:role='student' } = useQuery({
        queryKey: ['user-role', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data?.user?.role || 'student';
        }
    })


    
    
    return {role}
};

export default useRole;