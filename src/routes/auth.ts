import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import AuthController from "../controller/AuthController";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
//Login route
router.post("/login", AuthController.login);
router.get("/logout",[checkJwt],AuthController.logout)

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);
router.post("/change-password-admin", [checkJwt,checkRole(["ADMIN"])], AuthController.changePasswordAdmin);

export default router;