import type { Request, Response } from 'express';

import { SettingsService } from '../services/SettingsService';


class SettingsController {
  async create(req: Request, res: Response) {
    const { chat, username } = req.body;

    const settingsService = new SettingsService();

    try {
      const settings = await settingsService.create({ chat, username });

      res.json(settings);
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}


export { SettingsController };
