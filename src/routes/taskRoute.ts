import express from 'express'   
import { TaskController } from '../controllers/taskController'
import authentication from '../middleware/authentication';

const taskController = new TaskController();
const router = express.Router()

router.post('/task',       authentication.hasAuthorization, taskController.create)
router.get('/tasks',       authentication.hasAuthorization, taskController.getAll)
router.get('/task/:id',    authentication.hasAuthorization, taskController.getById)
router.put('/task/:id',    authentication.hasAuthorization, taskController.update)
router.delete('/task/:id', authentication.hasAuthorization, taskController.delete)

export default router
