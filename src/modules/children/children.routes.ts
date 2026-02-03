import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { childrenController } from "./children.controller";
import { createChildSchema, updateChildSchema, childIdParamSchema } from "./children.schemas";

const router = Router();

router.use(requireAuth);

router.post("/", validate(createChildSchema), childrenController.create);
router.get("/", childrenController.list);
router.get("/:id", validate(childIdParamSchema), childrenController.get);
router.patch("/:id", validate(childIdParamSchema.merge(updateChildSchema)), childrenController.update);
router.delete("/:id", validate(childIdParamSchema), childrenController.remove);

export default router;
