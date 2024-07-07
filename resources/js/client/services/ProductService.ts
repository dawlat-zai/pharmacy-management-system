import http from './http-common';
import { Product } from '../models/Product';
import { ProductInput } from '../models/ProductInput';
import { AxiosError } from 'axios';

export default class {
    public static getAll(search?: string, per_page?: number, page?: number, sortBy?: string, sortOrder?: string) {
        return new Promise((resolve, reject) => {
            http.get('/api/products', {
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

    public static create(product: ProductInput): Promise<Product> {
        return new Promise((resolve, reject) => {
            http.post('/api/products', product)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static get(id: number): Promise<Product> {
        return new Promise((resolve, reject) => {
            http.get('/api/products/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static update(id: number, product: ProductInput): Promise<Product> {
        return new Promise((resolve, reject) => {
            http.put('/api/products/'+id, product)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static delete(id: number): Promise<Product> {
        return new Promise((resolve, reject) => {
            http.delete('/api/products/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }
}
