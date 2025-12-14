import express from 'express';
import { getTasks, addTask, deleteTask, viewTask, updateTask } from '../controllers/taskController.js';
import userAuthCheck from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(userAuthCheck)

router.get('/list', getTasks)
router.patch('/edit/:taskId',updateTask)
router.post('/add',addTask)
router.get('/view/:taskId',viewTask)
router.delete('/:taskId',deleteTask)

export default router;