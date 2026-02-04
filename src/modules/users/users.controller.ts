import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const usersController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await usersService.login(req.body.email, req.body.password);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },
    async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await usersService.getMe(req.userId!);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },

    async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await usersService.updateMe(req.userId!, req.body);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },
};
