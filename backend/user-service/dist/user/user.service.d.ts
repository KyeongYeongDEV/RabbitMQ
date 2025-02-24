import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<User[]>;
    createUser(email: string, name?: string): Promise<User>;
}
