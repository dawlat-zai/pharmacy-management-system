import http from './http-common';
import { Category } from '../models/Category';
import { CategoryInput } from '../models/CategoryInput';
import { AxiosError } from 'axios';

export default class {
    public static getAll(search?: string, per_page?: number, page?: number, sortBy?: string, sortOrder?: string) {
        return new Promise((resolve, reject) => {
            http.get('/api/categories', {
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

    public static create(category: CategoryInput): Promise<Category> {
        return new Promise((resolve, reject) => {
            http.post('/api/categories', category)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static get(id: number): Promise<Category> {
        return new Promise((resolve, reject) => {
            http.get('/api/categories/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static update(id: number, category: CategoryInput): Promise<Category> {
        return new Promise((resolve, reject) => {
            http.put('/api/categories/'+id, category)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static delete(id: number): Promise<Category> {
        return new Promise((resolve, reject) => {
            http.delete('/api/categories/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }
}
