import http from './http-common';
import { Role } from '../models/Role';
import { AxiosError } from 'axios';
import { RoleCreate } from '../models/RoleCreate';
import { RoleUpdate } from '../models/RoleUpdate';

export default class {
    public static getAll(search?: string, per_page?: number, page?: number, sortBy?: string, sortOrder?: string) {
        return new Promise((resolve, reject) => {
            http.get('/api/roles', {
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

    public static create(role: RoleCreate): Promise<Role> {
        return new Promise((resolve, reject) => {
            http.post('/api/roles', role)
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
            http.get('/api/roles/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static update(id: number, user: RoleUpdate): Promise<Role> {
        return new Promise((resolve, reject) => {
            http.put('/api/roles/'+id, user)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static delete(id: number) {
        return new Promise((resolve, reject) => {
            http.delete('/api/roles/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }
}
