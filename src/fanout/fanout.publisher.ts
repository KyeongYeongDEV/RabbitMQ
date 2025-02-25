import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";

@Injectable()
export class FanoutPublisher {
  constructor (private readonly rabbitMQService : RabbitMQService) {}

  /**
   * 모든 Queue에 메세지를 발행
   * @param message - 전송할 메세지
   */
  async sendMessage(message : string) {
    await this.rabbitMQService.publish('fanout-exchange', '', { message });
  }
}