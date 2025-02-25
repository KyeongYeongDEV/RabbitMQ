import { Module } from '@nestjs/common';
import { DirectPublisher } from './direct.publisher';
import { DirectConsumer } from './direct.consumer';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers: [DirectPublisher, DirectConsumer, RabbitMQService],
})
export class DirectModule {}
