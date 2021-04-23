import { getCustomRepository } from 'typeorm';

import { ConnectionsRepository } from '../repositories/ConnectionsRepository';


interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}

class ConnectionsService {
  private connectionsRepository: ConnectionsRepository;

  constructor() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ socket_id, user_id, admin_id, id }: IConnectionCreate) {
    const connectionExists = await this.connectionsRepository.findOne({
      user_id,
    });

    if (connectionExists) {
      connectionExists.socket_id = socket_id;

      await this.connectionsRepository.save(connectionExists);

      return connectionExists;
    }

    const connection = this.connectionsRepository.create({
      socket_id, user_id, admin_id, id,
    });

    await this.connectionsRepository.save(connection);

    return connection;
  }
}


export { ConnectionsService };
