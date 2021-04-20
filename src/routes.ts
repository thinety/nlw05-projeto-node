import { Router } from 'express';
import { SettingsController } from './controllers/SettingsController';


const router = Router();

const settingsController = new SettingsController();

router.route('/settings')
  .post(settingsController.create);


export { router };
