import http from './http-common';
import { User } from '../models/User';
import { UserCreate } from '../models/UserCreate';
import { AxiosError } from 'axios';
import { UserUpdate } from '../models/UserUpdate';

export default class {
    public static getAuthUser(): Promise<User> {
        return new Promise((resolve, reject) => {
            http.get('/api/me')
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static getAll(search?: string, per_page?: number, page?: number, sortBy?: string, sortOrder?: string) {
        return new Promise((resolve, reject) => {
            http.get('/api/users', {
                params: {
                    search: search,
                    per_page: per_page,
                    page: page,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                },
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static create(user: UserCreate): Promise<User> {
        return new Promise((resolve, reject) => {
            http.post('/api/users', user)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static get(id: number) {
        return new Promise((resolve, reject) => {
            http.get('/api/users/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static update(id: number, user: UserUpdate): Promise<User> {
        return new Promise((resolve, reject) => {
            http.put('/api/users/'+id, user)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static delete(id: number): Promise<User> {
        return new Promise((resolve, reject) => {
            http.delete('/api/users/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }
}
