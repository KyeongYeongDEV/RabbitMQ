import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // CORS 허용
 // 데코레이터가 하는 역할은 무엇인가
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server : Server;

  private users = 0;

  handleConnection(client : Socket) {
    this.users++;
    this.server.emit('users', this.users);
    console.log(`Client cennected : ${client.id}, Total users: ${this.users}`);
  }

  handleDisconnect(client: Socket) {
    this.users--;
    this.server.emit('users', this.users);
    console.log(`client disconnected : ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data : { sender : string; message : string }) {
    console.log(`Message from ${data.sender}: ${data.message}`);
    this.server.emit('message', data);
  }
}
