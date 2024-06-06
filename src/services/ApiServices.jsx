import axios from 'axios';

const URL = 'https://reqres.in/api/users';

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
};

export default ApiServices;
