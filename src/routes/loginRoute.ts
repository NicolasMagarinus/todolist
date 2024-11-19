import express from 'express'   
import { LoginController } from '../controllers/loginController';

const loginController = new LoginController();
const router = express.Router()

router.post('/login', loginController.doLogin)

export default router
