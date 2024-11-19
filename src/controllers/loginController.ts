import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserRepository from "../repositories/userRepository";
import { appDataSource } from "../data-source";

export class LoginController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository(appDataSource);
    }

    doLogin = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(401).send("Email e senha obrigatórios!");
            return;
        }

        try {
            const user = await this.userRepository.getByEmail(email);

            if (!user) {
                res.status(401).send("Usuário não encontrado!");
                return;
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                res.status(401).send("Email e/ou senha incorretos!");
                return;
            }

            const token = jwt.sign(
                { email: user.email },
                process.env.TOKEN!,
                { expiresIn: '1h' }
            );

            res.status(200).json({ auth: true, token });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao processar login', error });
        }
    };
}
