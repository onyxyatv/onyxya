import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MediaService } from 'src/media/media.service';
import { UserService } from './users.service';

interface ActiveClient {
  id: string;
  userId: number;
  username: string;
  device: string;
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
  constructor(private readonly mediaService: MediaService) {
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
      device: UserService.formatUserAgent(
        client.handshake.headers['user-agent'],
      ),
    };
    this.activeClients[client.id] = activeClient;
    console.log('Client received :', client.id, data);
    //console.log(this.activeClients);
    this.updateClients();
    return this.activeClients.toString();
  }

  async handleDisconnect(client: Socket) {
    delete this.activeClients[client.id];
    if (Object.keys(this.activeClients).length === 0) {
      console.log("All clients disconnected -> Stream's clean");
      await this.mediaService.cleanAllMediaStreams();
    }
    this.updateClients();
  }

  updateClients() {
    this.server.emit('clients', this.activeClients);
  }
}
