import { Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const usersController = {
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
