import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<{
        name: string | null;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createUser(data: {
        email: string;
        name?: string;
    }): Promise<{
        name: string | null;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
