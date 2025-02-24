import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    createUser({ email, name }: CreateUserDto): Promise<User>;
}
