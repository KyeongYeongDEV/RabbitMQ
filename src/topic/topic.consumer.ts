import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";

/**
 * Topic Exchange에서 메세지를 소비하는 서비스
 */
@Injectable()
export class TopicConsumer implements OnModuleInit{
  constructor (private readonly rabbitMQService : RabbitMQService) {}

  async onModuleInit() {
    // news.sports 토픽을 구독하는 Queue
    await this.rabbitMQService.consume('queue-sports', 'topic-exchange', 'news.sports', (msg) => {
      console.log('[topic-consumer][SPORTS] Received : ', msg);
    });

    // news.weather 토픽을 구독하는 Queue
    await this.rabbitMQService.consume('queue-weather', 'topic-exchange', 'news.weather', (msg) => {
      console.log('[topic-consumer][WEATHER] Received : ', msg);
    });

    // news.* 와일드카드 토픽을 구독하는 Queue (sports, weather 등 모든 뉴스 카테고리 포함)
    await this.rabbitMQService.consume('queue-news-all', 'topic-exchange', 'news.*', (msg) => {
      console.log('[topic-consumer][ALL NEWS] Received : ', msg);
    })
  }
}