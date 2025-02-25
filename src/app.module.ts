import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { DirectModule } from './direct/direct.module';
import { FanoutModule } from './fanout/fanout.module';
import { HeadersModule } from './headers/headers.module';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    RabbitmqModule,
    DirectModule,
    FanoutModule,
    HeadersModule,
    TopicModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQService],
})
export class AppModule {}
