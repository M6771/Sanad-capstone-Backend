import { Response, NextFunction } from "express";
import { childrenService } from "./children.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const childrenController = {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await childrenService.create(req.userId!, req.body);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    },

    async list(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await childrenService.list(req.userId!);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },

    async get(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await childrenService.get(req.userId!, req.params.id as string);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await childrenService.update(req.userId!, req.params.id as string, req.body);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },

    async remove(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await childrenService.remove(req.userId!, req.params.id as string);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },
};
