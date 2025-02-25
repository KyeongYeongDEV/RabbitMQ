import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";

@Injectable()
export class TopicPublisher {
  constructor (private readonly rabbitMQService : RabbitMQService) {}

  /**
   * 특정 Topic을 가진 메세지를 발행 ("newq.*" -> 모든 뉴스관련 메세지 받기(news.sports, news.weather)
   * @param topic - 메세지를 보낼 토픽 키 (예 : news.sports)
   * @param message - 전송할 메세지
   */
  async sendMessage(topic : string, message : string) {
    await this.rabbitMQService.publish('topic-exchange', topic, { message });
  }
}