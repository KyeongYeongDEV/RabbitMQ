import { Module } from '@nestjs/common';
import { FanoutConsumer } from './fanout.consumer';
import { FanoutPublisher } from './fanout.publisher';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers : [FanoutConsumer, FanoutPublisher, RabbitMQService]
})
export class FanoutModule {}
