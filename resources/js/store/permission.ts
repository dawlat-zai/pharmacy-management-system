import { defineStore } from 'pinia';
import PermissionService from '@/client/services/PermissionService';

interface PermissionState {
    permissions: string[];
}

export const usePermissionStore = defineStore('permissions', {
    state: (): PermissionState => ({
        permissions: [],
    }),
    actions: {
        async fetchPermissions() {
            const permissions = await PermissionService.getUserPermissions();
            this.permissions = permissions.map((p) => p.name);
        },
        hasPermission(permission: string): boolean {
            return this.permissions.includes(permission);
        },
    },
});
