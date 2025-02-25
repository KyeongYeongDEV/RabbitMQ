import { Module } from '@nestjs/common';
import { HeadersConsumer } from './headers.consumer';
import { HeadersPublisher } from './headers.publisher';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers : [HeadersConsumer, HeadersPublisher, RabbitMQService]
})
export class HeadersModule {}
