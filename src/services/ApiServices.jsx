import axios from 'axios';

const URL = 'https://reqres.in/api/users';
const URL_LOGIN = 'https://reqres.in/api/login';

const ApiServices = {
    ApiGetUsers: async (page) => {
        return await axios(`${URL}?page=${page}`);
    },
    ApiPostUser: async (name, job) => {
        return await axios.post(URL, { name, job });
    },
    ApiUpdateUser: async (id, name, job) => {
        return await axios.put(`${URL}/${id}`, { name, job });
    },
    ApiDeleteUser: async (id) => {
        return await axios.delete(`${URL}/${id}`);
    },
    ApiLogin: async (email, password) => {
        return await axios.post(`${URL_LOGIN}`, { email, password });
    },
};

export default ApiServices;
