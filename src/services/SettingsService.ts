import { getCustomRepository } from 'typeorm';

import { SettingsRepository } from '../repositories/SettingsRepository';


interface ISettingCreate {
  chat: boolean;
  username: string;
}

class SettingsService {
  private settingsRepository: SettingsRepository;

  constructor() {
    this.settingsRepository = getCustomRepository(SettingsRepository);
  }

  async create({ chat, username }: ISettingCreate) {
    // SELECT * FROM settings WHERE username = "username" LIMIT 1;
    const userAlreadyExists = await this.settingsRepository.findOne({
      username,
    });

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    const settings = this.settingsRepository.create({
      chat,
      username,
    });

    await this.settingsRepository.save(settings);

    return settings;
  }
}


export { SettingsService };
