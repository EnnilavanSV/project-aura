import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // This points to  Express Bouncer!
});

//this automatically attaches your Vip badge to every request later
API.interceptors.request.use((config) => {  //passing the request
    const token = localStorage.getItem('aura_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; //creating the neew tag to the header named authorization and add the token to it with the prefix bearer
    }
    return config;  //unpassing the request
})

export default API