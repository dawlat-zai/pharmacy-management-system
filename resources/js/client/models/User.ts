import { Role } from "./Role";

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
};
