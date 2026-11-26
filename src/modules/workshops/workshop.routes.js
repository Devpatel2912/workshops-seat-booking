import { Router } from "express";

import * as workshopController from "./workshop.controller.js";

import { authenticate, allowRoles } from "../../middleware/role.middleware.js";
import { createWorkshopValidation } from "./create-workshop.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  allowRoles("organizer"),
  createWorkshopValidation,
  workshopController.create,
);

router.get("/", authenticate, allowRoles("organizer", "user"), workshopController.getAll);

router.get("/:id", authenticate, allowRoles("organizer", "user"), workshopController.getOne);

router.put("/:id", authenticate, allowRoles("organizer"), workshopController.update);

router.delete("/:id", authenticate, allowRoles("organizer"), workshopController.remove);

export default router;
