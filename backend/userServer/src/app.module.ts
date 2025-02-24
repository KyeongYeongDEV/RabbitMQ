import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ChatModule, 
    PrismaModule, 
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // 환경 변수를 전역으로 사용 가능하게 설정
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, ChatGateway, PrismaService, UserService],
})
export class AppModule {}
