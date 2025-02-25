import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

/**
 * Headers Exchange에서 메시지를 소비하는 서비스
 */
@Injectable()
export class HeadersConsumer implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    const exchange = 'headers-exchange';

    // ✅ "x-match = any": user 또는 role 중 하나만 일치하면 메시지를 받음
    await this.rabbitMQService.consumeWithHeaders(
      'queue-any-match',
      exchange,
      { 'x-match': 'any', user: 'vip', role: 'admin' },
      (msg) => {
        console.log('✅ [ANY MATCH] Received:', msg);
      }
    );

    // ✅ "x-match = all": user와 role이 모두 일치해야 메시지를 받음
    await this.rabbitMQService.consumeWithHeaders(
      'queue-all-match',
      exchange,
      { 'x-match': 'all', user: 'vip', role: 'admin' },
      (msg) => {
        console.log('✅ [ALL MATCH] Received:', msg);
      }
    );
  }
}
