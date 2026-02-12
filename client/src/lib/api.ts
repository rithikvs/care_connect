const API_URL = import.meta.env.VITE_API_URL || 'https://care-connect-tu0r.onrender.com/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (res: Response) => {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
    }
    return data;
};

export const api = {
    auth: {
        signup: async (data: any) => {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return handleResponse(res);
        },
        login: async (data: any) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return handleResponse(res);
        },
    },
    patients: {
        getAll: async () => {
            const res = await fetch(`${API_URL}/patients`, {
                headers: getHeaders(),
            });
            return handleResponse(res);
        },
        create: async (data: any) => {
            const res = await fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(res);
        },
        delete: async (id: string) => {
            const res = await fetch(`${API_URL}/patients/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            return handleResponse(res);
        },
    },
    volunteers: {
        getAll: async () => {
            const res = await fetch(`${API_URL}/volunteers`, {
                headers: getHeaders(),
            });
            return handleResponse(res);
        },
        create: async (data: any) => {
            const res = await fetch(`${API_URL}/volunteers`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(res);
        },
        delete: async (id: string) => {
            const res = await fetch(`${API_URL}/volunteers/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            return handleResponse(res);
        },
    },
};
