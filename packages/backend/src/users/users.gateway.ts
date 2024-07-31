import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ActiveClient {
  id: string;
  userId: number;
  username: string;
}

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
  constructor() {
    this.activeClients = {};
  }

  @WebSocketServer()
  server: Server;

  private activeClients: object;

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): string {
    const activeClient: ActiveClient = {
      id: client.id,
      userId: data.id,
      username: data.username,
    };
    this.activeClients[client.id] = activeClient;
    console.log('Client received :', client.id, data);
    console.log(this.activeClients);
    this.updateClients();
    return this.activeClients.toString();
  }

  handleDisconnect(client: Socket) {
    //this.activeClients -= 1;
    console.log(this.activeClients);
    console.log(`Client disconnected: ${client.id}`);
    this.updateClients();
  }

  updateClients() {
    this.server.emit('clients', this.activeClients);
  }
}
