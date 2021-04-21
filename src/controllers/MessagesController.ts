import type { Request, Response } from 'express';

import { MessagesService } from '../services/MessagesService';


class MessagesController {
  async create(req: Request, res: Response) {
    const { text, admin_id, user_id } = req.body;

    const messagesService = new MessagesService();

    const message = await messagesService.create({
      text, admin_id, user_id,
    });

    res.json(message);
  }

  async showByUser(req: Request, res: Response) {
    const { id } = req.params;

    const messagesService = new MessagesService();

    const list = await messagesService.listByUser({
      user_id: id,
    });

    res.json(list);
  }
}


export { MessagesController };
