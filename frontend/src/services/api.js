import axios from "axios";


const api = axios.create({

    /*
     * Local development:
     * http://localhost:8080/api
     *
     * Production:
     * VITE_API_BASE_URL will contain
     * the deployed backend URL.
     */
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8080/api",

    headers: {
        "Content-Type": "application/json",
    },

});


/*
 * ---------------------------------------------------------
 * JWT REQUEST INTERCEPTOR
 * ---------------------------------------------------------
 *
 * Automatically adds the JWT token to every API request.
 *
 * Example:
 *
 * Authorization: Bearer eyJ...
 *
 */
api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }


        return config;
    },


    (error) => {

        return Promise.reject(error);
    }
);


export default api;