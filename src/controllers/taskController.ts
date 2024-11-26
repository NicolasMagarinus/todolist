import { Request, Response } from "express";
import { appDataSource } from "../data-source";
import TaskRepository from "../repositories/taskRepository";
import { sendMessage } from "../broker/producer";

export class TaskController {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository(appDataSource);
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const tasks = await this.taskRepository.getAll();
        res.status(200).json(tasks);
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const task = await this.taskRepository.getById(parseInt(req.params.id));

        if (!task) {
            res.status(404).json({ message: "Task not found" });
        } else {
            res.status(200).json(task);
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const { tittle, description, startDate, endDate, priority } = req.body;

        if (!tittle || !description || !startDate || !endDate || !priority) {
            res.status(400).json({ message: "Tittle, description, startDate, endDate, and priority are required." });
            return;
        }

        try {
            const newTask = await this.taskRepository.create({
                tittle,
                description,
                startDate,
                endDate,
                priority
            });

            await sendMessage('task_created', { newTask });

            res.status(201).json(newTask);
        } catch (error) {
            res.status(400).json({ message: "Error creating task", error });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const { tittle, description, startDate, endDate, priority } = req.body;

        if (!tittle || !description || !startDate || !endDate || !priority) {
            res.status(400).json({ message: "Tittle, description, startDate, endDate, and priority are required." });
            return;
        }

        try {
            const updatedTask = await this.taskRepository.update(parseInt(req.params.id), {
                tittle,
                description,
                startDate,
                endDate,
                priority
            });

            await sendMessage('task_updated', { updatedTask });

            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(400).json({ message: "Error updating task", error });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const taskId = parseInt(req.params.id);
        const success = await this.taskRepository.delete(taskId);

        if (!success) {
            res.status(404).json({ message: "Task not found" });
        } else {
            await sendMessage('task_deleted', { id: taskId });

            res.status(200).json({ message: "Task successfully deleted." });
        }
    };
}