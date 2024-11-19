import { Request, Response } from "express";
import { appDataSource } from "../data-source";
import UserRepository from "../repositories/userRepository";
import bcrypt from 'bcryptjs';

export class UserController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository(appDataSource);
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const users = await this.userRepository.getAll();
        res.status(200).json(users);
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userRepository.getById(parseInt(req.params.id));

        if (!user) {
            res.status(404).json({message: "User not found."});
        } else {
            res.status(200).json(user);
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email, and password are required." });
            return;
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.userRepository.create({
                name,
                email,
                password: hashedPassword
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: "Error creating user", error });
        }
    };
    

    update = async (req: Request, res: Response): Promise<void> => {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email, and password are required." });
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const updatedUser = await this.userRepository.update(parseInt(req.params.id), {
                name,
                email,
                password: hashedPassword
            });

            if (!updatedUser) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(updatedUser);
            }
        } catch (error) {
            res.status(400).json({ message: "Error updating user", error });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const success = await this.userRepository.delete(parseInt(req.params.id));

        if (!success) {
            res.status(404).json({ message: "User not found"});
        } else {
            res.status(200).json({message: "User successfully deleted."});
        }
    };
}