import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(id: number): Promise<{
        email: string;
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(): Promise<{
        email: string;
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createUser(createUserDto: CreateUserDto): Promise<{
        email: string;
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
