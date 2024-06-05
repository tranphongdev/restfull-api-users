import axios from 'axios';

const URL = 'https://reqres.in/api/users?page=1';

const ApiServices = {
    ApiGetUsers: async () => {
        return await axios(URL);
    },
};

export default ApiServices;
