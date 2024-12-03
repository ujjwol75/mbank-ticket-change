import axios from "axios";

export const loginUser = (loginDetail) => {
    return axios.post('http://localhost:8080/public/authenticate', loginDetail)
        .then((response) => response.data)
        .catch((error) => {
            // Handle error appropriately
            console.error('Login error:', error);
            throw error; // or handle the error as needed
        });
};