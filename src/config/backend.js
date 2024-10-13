import { useUserStore } from '@/store/user.js';
import axios from 'axios';

export const backend = {
    url: 'http://51.89.92.1:8080'
}

export function sendLoggedInRequest(path, data)
{
    return axios.post(backend.url + path, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${useUserStore().token}`
        }
    })
}

export default backend