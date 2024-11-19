import express from 'express'   
import { UserController } from '../controllers/userController'
import authentication from '../middleware/authentication';

const userController = new UserController();
const router = express.Router()

router.post('/user', userController.create)
router.get('/users', authentication.hasAuthorization, userController.getAll)
router.get('/user/:id', authentication.hasAuthorization, userController.getById)
router.put('/user/:id', authentication.hasAuthorization, userController.update)
router.delete('/user/:id', authentication.hasAuthorization, userController.delete)

export default router
