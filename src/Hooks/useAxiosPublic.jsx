import axios from "axios";

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://tutor-owl.vercel.app", // Fallback to local if env missing
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
