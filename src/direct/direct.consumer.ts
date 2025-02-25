import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";

/**
 * Direct Exchange에서 메시지를 소비하는 서비스
 */
@Injectable()
export class DirectConsumer implements OnModuleInit {
  constructor (private readonly rabbitMQService : RabbitMQService) {}

  /**
   * 모듈이 초기화될 때 두 개의 Queue를 바인딩하여 메세지를 소비
   * 특정 Routing Key("info", "error")에 따라 메시지를 다른 Queue로 전달.
   */  
  async onModuleInit() {
    // info 라우팅 키를 가진 메세지를 소비하는 Queue
    await this.rabbitMQService.consume('queue-info', 'direct-exchane', 'info', (msg) => {
      console.log('[direct-consumer][Info] Received : ', msg);
    });
  
    // error 라우팅 키를 가진 메세지를 소비하는 Queue
    await this.rabbitMQService.consume('queue-error', 'direct-exchange', 'info', (msg) => {
      console.log('[direct-consumer][Error] Received : ', msg);
    })
  } 
}