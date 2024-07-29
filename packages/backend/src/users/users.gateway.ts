import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(3002, {
  namespace: ['userEvents'],
  transports: ['websocket', 'polling'],
  cors: {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,POST,OPTION',
    allowedHeaders: ['Content-Type'],
    credentials: false,
  },
})
export class UserGateway {
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log(client.id);
    return data;
  }
}
