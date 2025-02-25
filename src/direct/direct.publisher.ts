import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";

@Injectable()
export class DirectPublisher {
  constructor (private readonly rabbitMQService : RabbitMQService) {}

  /**
   * 특정 Routing Key를 가진 메세지를 발행
   * @param routingKey - 메세지를 보낼 라우팅 키
   * @param message  - 전송할 메세지
   */
  async sendMessage(routingKey : string, message : string) {
    await this.rabbitMQService.publish('direct-exchange', routingKey, { message });
  }
}