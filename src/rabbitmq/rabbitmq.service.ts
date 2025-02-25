import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private isChannelReady = false; // 채널 상태 확인 변수

  /**
   * 서비스가 초기화될 때 RabbitMQ 연결 및 채널 생성
   */
  async onModuleInit() {
    try {
      console.log('⌛ RabbitMQ 연결 중...');
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      this.isChannelReady = true; // 채널이 정상적으로 생성됨
      console.log('✅ RabbitMQ 연결 성공 & 채널 생성 완료');
    } catch (error) {
      console.error('❌ RabbitMQ 연결 실패:', error);
    }
  }

  /**
   * RabbitMQ 채널이 완전히 초기화될 때까지 기다리는 함수
   */
  private async ensureChannel() {
    let retries = 5; // 최대 5번 재시도
    while (!this.isChannelReady && retries > 0) {
      console.log(`⌛ RabbitMQ 채널이 아직 생성되지 않음. 대기 중... (${6 - retries}/5)`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
      retries--;
    }

    if (!this.channel) {
      throw new Error('❌ RabbitMQ 채널을 생성할 수 없습니다. 서버를 다시 시작하세요.');
    }
  }

  /**
   * 서비스가 종료될 때 RabbitMQ 연결 및 채널 닫기
   */
  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  /**
   * RabbitMQ로 메시지를 발행하는 함수
   */
  async publish(exchange: string, routingKey: string, message: any, options = {}) {
    await this.ensureChannel(); // 채널이 준비되었는지 확인
    await this.channel.assertExchange(exchange, 'direct', { durable: true });
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), options);
    console.log(`📨 Sent to [${exchange}] with key [${routingKey}]:`, message);
  }

  /**
   * RabbitMQ에서 메시지를 소비하는 함수
   */
  async consume(queue: string, exchange: string, routingKey: string, callback: (msg: any) => void) {
    await this.ensureChannel(); // 채널이 준비될 때까지 대기
    await this.channel.assertExchange(exchange, 'direct', { durable: true });
    const q = await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(q.queue, exchange, routingKey);

    this.channel.consume(q.queue, (msg) => {
      if (msg) {
        callback(JSON.parse(msg.content.toString()));
        this.channel.ack(msg);
      }
    });
  }

  /**
   * Headers Exchange에서 특정 헤더 조건을 만족하는 메시지를 소비
   */
  async consumeWithHeaders(queue: string, exchange: string, headers: any, callback: (msg: any) => void) {
    await this.ensureChannel(); // 채널이 준비될 때까지 대기
    await this.channel.assertExchange(exchange, 'headers', { durable: true }); // ✅ 'headers' 타입으로 생성
    const q = await this.channel.assertQueue(queue, { durable: true });

    await this.channel.bindQueue(q.queue, exchange, '', headers);

    this.channel.consume(q.queue, (msg) => {
      if (msg) {
        callback(JSON.parse(msg.content.toString()));
        this.channel.ack(msg);
      }
    });
  }
}
