import axios from 'axios';
import React, { use, useEffect } from 'react';
import { AuthContext } from '../Providers/AuthContext';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
})

const useAxiosSecure = () => {
    const { user, LogOut } = useAuth()
    const navigate = useNavigate()


    useEffect(() => {

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
                console.log(error);

                const statusCode = error.response.status
                if (statusCode===401 || statusCode===403) {
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

    }, [LogOut, navigate, user?.accessToken])
    return axiosSecure;
};

export default useAxiosSecure;