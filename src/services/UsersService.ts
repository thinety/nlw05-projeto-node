import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';


interface IUserCreate {
  email: string;
}

class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async create({ email }: IUserCreate) {
    const userExists = await this.usersRepository.findOne({
      email,
    });

    if (userExists) {
      return userExists;
    }

    const user = this.usersRepository.create({
      email,
    });

    await this.usersRepository.save(user);

    return user;
  }
}


export { UsersService };
