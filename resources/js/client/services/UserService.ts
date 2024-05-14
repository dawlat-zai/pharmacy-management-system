import http from './http-common';
import { User } from '../models/User';

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

    public static getAll(
        search?: string,
        per_page?: number,
        page?: number,
        sortBy?: string,
        sortOrder?: string,
    ): Promise<User> {
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
}
