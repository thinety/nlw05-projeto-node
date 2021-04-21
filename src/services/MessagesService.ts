import { getCustomRepository } from 'typeorm';

import { MessagesRepository } from '../repositories/MessagesRepository';


interface IMessageCreate {
  text: string;
  admin_id?: string;
  user_id: string;
}

interface IMessageListByUser {
  user_id: string;
}

class MessagesService {
  private messagesRepository: MessagesRepository;

  constructor() {
    this.messagesRepository = getCustomRepository(MessagesRepository);
  }

  async create({ text, admin_id, user_id }: IMessageCreate) {
    const message = this.messagesRepository.create({
      text, admin_id, user_id,
    });

    await this.messagesRepository.save(message);

    return message;
  }

  async listByUser({ user_id }: IMessageListByUser) {
    const list = await this.messagesRepository.find({
      where: { user_id },
      relations: ['user'],
    });

    return list;
  }
}


export { MessagesService };
