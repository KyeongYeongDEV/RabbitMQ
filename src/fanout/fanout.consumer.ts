import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

/**
 * Fanout Exchange에서 메시지를 소비하는 서비스 (예 : 서버 장애시 모든 큐에 "서버 장애 발생" 메세지가 동시에 전송됨)
 */
@Injectable()
export class FanoutConsumer implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    // 모든 Queue가 동일한 메시지를 받음 (Broadcast)
    await this.rabbitMQService.consume('queue-logs', 'fanout-exchange', '', (msg) => {
      console.log('[fanout] [LOGS] Received:', msg);
    });

    await this.rabbitMQService.consume('queue-alerts', 'fanout-exchange', '', (msg) => {
      console.log('[fanout] [ALERTS] Received:', msg);
    });

    await this.rabbitMQService.consume('queue-notifications', 'fanout-exchange', '', (msg) => {
      console.log('[fanout] [NOTIFICATIONS] Received:', msg);
    });
  }
}
