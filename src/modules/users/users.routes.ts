import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { usersController } from "./users.controller";
import { updateMeSchema } from "./users.schemas";

const router = Router();

router.get("/me", requireAuth, usersController.getMe);
router.patch("/me", requireAuth, validate(updateMeSchema), usersController.updateMe);

export default router;
