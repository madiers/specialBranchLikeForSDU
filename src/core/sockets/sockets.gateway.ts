import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { TokenPayload } from "@/@types";
import { ProtectedWS } from "../decorators/protected-ws.decorator";
import { ParseTokenPipe } from "../pipes/parse-token.pipe";

@WebSocketGateway(12228)
export class SocketsGateway {
  @WebSocketServer()
  public readonly server: Server;

  @ProtectedWS("user", "service")
  @SubscribeMessage("subscribe")
  public async subscribe(
    @MessageBody(ParseTokenPipe) token: TokenPayload,
    @ConnectedSocket() client: Socket
  ) {
    console.log(token);
    await client.join(`orders.${token.role}: ` + token.phone);
    return { result: true };
  }
}
