import http from './http-common';
import { Manufacturer } from '../models/Manufacturer';
import { ManufacturerInput } from '../models/ManufacturerInput';
import { AxiosError } from 'axios';

export default class {
    public static getAll(search?: string, per_page?: number, page?: number, sortBy?: string, sortOrder?: string) {
        return new Promise((resolve, reject) => {
            http.get('/api/manufacturers', {
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

    public static create(manufacturer: ManufacturerInput): Promise<Manufacturer> {
        return new Promise((resolve, reject) => {
            http.post('/api/manufacturers', manufacturer)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static get(id: number): Promise<Manufacturer> {
        return new Promise((resolve, reject) => {
            http.get('/api/manufacturers/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static update(id: number, manufacturer: ManufacturerInput): Promise<Manufacturer> {
        return new Promise((resolve, reject) => {
            http.put('/api/manufacturers/'+id, manufacturer)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    public static delete(id: number): Promise<Manufacturer> {
        return new Promise((resolve, reject) => {
            http.delete('/api/manufacturers/'+id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }
}
