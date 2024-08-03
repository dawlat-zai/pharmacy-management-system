import { SaleInput } from '../models/SaleInput';
import http from './http-common';
import { AxiosError } from 'axios';

export default class {
    public static create(sale: SaleInput) {
        return new Promise((resolve, reject) => {
            http.post('/api/sales', sale)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }
}