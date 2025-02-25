import { Module } from '@nestjs/common';
import { TopicConsumer } from './topic.consumer';
import { TopicPublisher } from './topic.publisher';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers : [TopicConsumer, TopicPublisher, RabbitMQService]
})
export class TopicModule {}
