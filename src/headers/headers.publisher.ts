import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

/**
 * Headers Exchange를 사용하여 메시지를 발행하는 서비스
 */
@Injectable()
export class HeadersPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  /**
   * 특정 Header 값을 가진 메시지를 발행
   * @param headers - 메시지를 보낼 헤더 (예: { user: "vip", role: "admin" })
   * @param message - 전송할 메시지
   */
  async sendMessage(headers: any, message: string) {
    await this.rabbitMQService.publish('headers-exchange', '', { message }, { headers });
    console.log(`📨 Sent with headers:`, headers);
  }
}
