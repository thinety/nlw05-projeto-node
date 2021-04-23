import { Router } from 'express';

import { SettingsController } from './controllers/SettingsController';
import { UsersController } from './controllers/UsersController';
import { MessagesController } from './controllers/MessagesController';


const router = Router();

const settingsController = new SettingsController();
const usersController = new UsersController();
const messagesController = new  MessagesController();

router.route('/settings')
  .post(settingsController.create);

router.route('/settings/:username')
  .get(settingsController.findByUsername)
  .put(settingsController.update);

router.route('/users')
  .post(usersController.create);

router.route('/messages')
  .post(messagesController.create);

router.route('/messages/:id')
  .get(messagesController.showByUser);


export { router };
