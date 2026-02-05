import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { usersController } from "./users.controller";
import { registerSchema, updateMeSchema, loginSchema } from "./users.schemas";

const router = Router();

router.post("/register", validate(registerSchema), usersController.register);
router.post("/login", validate(loginSchema), usersController.login);
router.get("/me", requireAuth, usersController.getMe);
router.patch("/me", requireAuth, validate(updateMeSchema), usersController.updateMe);

export default router;
