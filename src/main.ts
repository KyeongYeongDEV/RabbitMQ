import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DirectPublisher } from './direct/direct.publisher';
import { TopicPublisher } from './topic/topic.publisher';
import { HeadersPublisher } from './headers/headers.publisher';
import { FanoutPublisher } from './fanout/fanout.publisher';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);

  // ⌛ RabbitMQ 연결 후 메시지를 발행하도록 3초 대기
  setTimeout(async () => {
    console.log('📨 Sending test messages to RabbitMQ...');

    try {
      const directPublisher = app.get(DirectPublisher);
      const topicPublisher = app.get(TopicPublisher);
      const headersPublisher = app.get(HeadersPublisher);
      const fanoutPublisher = app.get(FanoutPublisher);

      // ✅ Direct Exchange 테스트 (특정 Routing Key로 메시지 전송)
      await directPublisher.sendMessage('info', 'ℹ️ This is an info message');
      await directPublisher.sendMessage('error', '❌ This is an error message');

      // ✅ Topic Exchange 테스트 (패턴 기반 라우팅)
      await topicPublisher.sendMessage('news.sports', '🏀 Sports news update!');
      await topicPublisher.sendMessage('news.weather', '🌦 Weather forecast for today');

      // ✅ Headers Exchange 테스트 (x-match 사용)
      await headersPublisher.sendMessage({ 'x-match': 'any', user: 'vip' }, '💎 VIP 회원 메시지');
      await headersPublisher.sendMessage({ 'x-match': 'all', user: 'vip', role: 'admin' }, '🔑 VIP 관리자 메시지');

      // ✅ Fanout Exchange 테스트 (모든 Queue에 메시지 전송)
      await fanoutPublisher.sendMessage('🚨 System alert: Maintenance in 5 minutes!');

      console.log('✅ All messages have been sent successfully.');
    } catch (error) {
      console.error('❌ Error sending messages:', error);
    }
  }, 3000); // 3초 대기 후 실행
}

bootstrap();
