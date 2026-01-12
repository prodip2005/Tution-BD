import axios from 'axios';
import React, { use, useEffect } from 'react';
import { AuthContext } from '../Providers/AuthContext';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: 'https://tutor-owl.vercel.app'
})

const useAxiosSecure = () => {
    const { user, LogOut, loading } = useAuth()
    const navigate = useNavigate()


    useEffect(() => {

        if (loading || !user?.accessToken) {
            return
        }

        // interceptop request
        const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })


        // interceptop response
        const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response
        },
            (error) => {


                const statusCode = error.response.status
                if (statusCode === 401 || statusCode === 403) {
                    LogOut().then(() => {
                        navigate('/login')
                    })
                }
                return Promise.reject(error)

            })

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }

    }, [LogOut, navigate, user?.accessToken, loading])
    return axiosSecure;
};

export default useAxiosSecure;