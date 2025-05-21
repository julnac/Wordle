import { Request, Response } from "express";

export default class AuthController {
    private userService: any;

    constructor(userService: any) {
        this.userService = userService;
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body as { username: string; password: string };
            const newUser = await this.userService.createUser(username, password);
            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error: any) {
            res.status(500).json({ message: "Error registering user", error: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body as { username: string; password: string };
            const token = await this.userService.authenticateUser(username, password);
            if (token) {
                res.status(200).json({ message: "Login successful", token });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error: any) {
            res.status(500).json({ message: "Error logging in", error: error.message });
        }
    }
}