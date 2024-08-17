import http from './http-common';
import { Supplier } from '../models/Supplier';
import { SupplierInput } from '../models/SupplierInput';
import { AxiosError } from 'axios';

export default class {
    public static getAll(search?: string, per_page?: number, page?: number, sortBy?: string, sortOrder?: string) {
        return new Promise((resolve, reject) => {
            http.get('/api/suppliers', {
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

    public static create(supplier: SupplierInput): Promise<Supplier> {
        return new Promise((resolve, reject) => {
            http.post('/api/suppliers', supplier)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static get(id: number): Promise<Supplier> {
        return new Promise((resolve, reject) => {
            http.get('/api/suppliers/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static update(id: number, supplier: SupplierInput): Promise<Supplier> {
        return new Promise((resolve, reject) => {
            http.put('/api/suppliers/'+id, supplier)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static delete(id: number): Promise<Supplier> {
        return new Promise((resolve, reject) => {
            http.delete('/api/suppliers/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }
}
