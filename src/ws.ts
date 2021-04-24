import { Server } from 'socket.io';

import { Message } from './entities/Message';
import { Connection } from './entities/Connection';

import { ConnectionsService } from './services/ConnectionsService';
import { UsersService } from './services/UsersService';
import { MessagesService } from './services/MessagesService';


interface ClientEvents {
  client_first_access: (params: { text: string, email: string }) => void;
  admin_user_in_support: (params: { user_id: string }) => void;
  admin_list_messages_by_user: (params: { user_id: string }, fn: (messages: Message[]) => void) => void;
  admin_send_message: (params: { text: string, user_id: string }) => void;
  client_send_to_admin: (params: { text: string, admin_socket_id: string }) => void;
}
interface ServerEvents {
  client_list_all_messages: (messages: Message[]) => void;
  admin_list_all_users: (connections: Connection[]) => void;
  admin_send_to_client: (message: { text: string, socket_id: string }) => void;
  admin_receive_message: (message: { message: Message, socket_id: string }) => void;
}

const io = new Server<ClientEvents, ServerEvents>();

io.on('connection', (socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on('client_first_access', async (params) => {
    const { text, email } = params;

    const user = await usersService.create({
      email,
    });

    await connectionsService.create({
      socket_id: socket.id,
      user_id: user.id,
    });

    await messagesService.create({
      text,
      user_id: user.id,
    });

    const allMessages = await messagesService.listByUser({
      user_id: user.id,
    });

    socket.emit('client_list_all_messages', allMessages);

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
    io.emit('admin_list_all_users', allConnectionsWithoutAdmin);
  });

  socket.on('client_send_to_admin', async (params) => {
    const { text, admin_socket_id } = params;

    const { user_id } = await connectionsService.findBySocketId(socket.id);

    const message = await messagesService.create({
      text,
      user_id,
    });

    io.to(admin_socket_id).emit('admin_receive_message', {
      message,
      socket_id: socket.id,
    });
  });
});

io.on('connection', async (socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
  socket.emit('admin_list_all_users', allConnectionsWithoutAdmin);

  socket.on('admin_user_in_support', async (params) => {
    const { user_id } = params;
    await connectionsService.updateAdminId(user_id, socket.id);

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
    io.emit('admin_list_all_users', allConnectionsWithoutAdmin);
  });

  socket.on('admin_list_messages_by_user', async (params, fn) => {
    const { user_id } = params;

    const allMessages = await messagesService.listByUser({ user_id });

    fn(allMessages);
  });

  socket.on('admin_send_message', async (params) => {
    const { text, user_id } = params;

    await messagesService.create({
      text,
      user_id,
      admin_id: socket.id,
    });

    const { socket_id } = await connectionsService.findByUserId(user_id);

    io.to(socket_id).emit('admin_send_to_client', {
      text,
      socket_id: socket.id,
    });
  });
});


export { io };
