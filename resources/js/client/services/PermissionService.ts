import { Permission } from '../models/Permission';
import http from './http-common';

export default class {
    public static getAll():Promise<Permission[]> {
        return new Promise((resolve, reject) => {
            http.get('/api/permissions')
                .then((response) => {
                    resolve(response.data as Permission[]);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
