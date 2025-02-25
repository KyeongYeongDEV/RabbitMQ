import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib'

/*
  관리자 데쉬보드 http://localhost:15672
  아 : guest
  비 : guest
*/

/**
 * RabbitMQ 연결 및 메시지 발행/소비를 관리하는 서비스
 */
@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  /**
   * 서비스가 초기화될 때 RabbitMQ 연결 및 채널 생성
   */
  async onModuleInit() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      console.log('✅ RabbitMQ 연결 성공');
    } catch (error) {
      console.error('❌ RabbitMQ 연결 실패:', error);
    }
  }


  /**
   * RabbitMQ 채널이 생성될 때까지 기다리는 함수
   */
  private async ensureChannel() {
    while (!this.channel) {
      console.log('⌛ RabbitMQ 채널이 아직 생성되지 않음. 대기 중...');
      await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
    }
  }

  /**
   * 서비스가 종료될 때 RabbitMQ 연결 및 채널 닫기
   */
  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  /**
   * RabbitMQ로 메시지를 발행하는 함수
   * @param exchange - 발행할 Exchange 이름
   * @param routingKey - 메시지 라우팅 키 (Direct, Topic에서 사용)
   * @param message - 전송할 메시지 객체
   * @param options - 추가 설정 (Headers Exchange에서 사용)
   */
  async publish(exchange: string, routingKey: string, message: any, options = {}) {
    await this.ensureChannel(); // 채널이 준비되었는지 확인
    await this.channel.assertExchange(exchange, 'direct', { durable: true }); // Exchange 선언
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), options); // 메시지 발행
    console.log(`📨 Sent to [${exchange}] with key [${routingKey}]:`, message);
  }

  /**
   * RabbitMQ에서 메시지를 소비하는 함수
   * @param queue - 소비할 Queue 이름
   * @param exchange - 바인딩할 Exchange 이름
   * @param routingKey - 메시지를 받을 Routing Key (Direct, Topic에서 사용)
   * @param callback - 메시지를 받았을 때 실행할 콜백 함수
   */
  async consume(queue: string, exchange: string, routingKey: string, callback: (msg: any) => void) {
    await this.ensureChannel(); // 채널이 준비될 때까지 대기
    await this.channel.assertExchange(exchange, 'direct', { durable: true }); // Exchange 선언
    const q = await this.channel.assertQueue(queue, { durable: true }); // Queue 선언
    await this.channel.bindQueue(q.queue, exchange, routingKey); // Queue를 Exchange에 바인딩

    this.channel.consume(q.queue, (msg) => {
      if (msg) {
        callback(JSON.parse(msg.content.toString())); // 메시지 처리
        this.channel.ack(msg); // 메시지 확인 (ACK)
      }
    });
  }

    /**
   * Headers Exchange에서 특정 헤더 조건을 만족하는 메시지를 소비
   * @param queue - 큐 이름
   * @param exchange - 바인딩할 Exchange
   * @param headers - 메시지를 받을 헤더 조건 (x-match 포함)
   * @param callback - 메시지 처리 함수
   */
    async consumeWithHeaders(queue: string, exchange: string, headers: any, callback: (msg: any) => void) {
      await this.channel.assertExchange(exchange, 'headers', { durable: true });
      const q = await this.channel.assertQueue(queue, { durable: true });
  
      // 🎯 Headers 기반으로 Queue 바인딩 (x-match 포함)
      await this.channel.bindQueue(q.queue, exchange, '', headers);
  
      this.channel.consume(q.queue, (msg) => {
        if (msg) {
          callback(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
        }
      });
    }
}
