import { useUserStore } from '@/store/user.js';
import axios from 'axios';

export const backend = {
    url: 'https://51.89.92.138:8081'
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