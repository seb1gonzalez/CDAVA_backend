import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import UserController from "../controller/UserController";

const router = Router();

//Get all users
router.get("/getUsers", [checkJwt, checkRole(["ADMIN"])], UserController.listAll);

// Get one user
router.get("/:id([0-9]+)",[checkJwt, checkRole(["ADMIN"])],UserController.getOneById
);

//Create a new user
router.post("/newUser", [checkJwt, checkRole(["ADMIN"])], UserController.newUser);

//Edit one user
router.patch("/editUser/:id([0-9]+)",[checkJwt, checkRole(["ADMIN"])],UserController.editUser
);

//Delete one user
router.delete("/deleteUser/:id([0-9]+)",[checkJwt, checkRole(["ADMIN"])],UserController.deleteUser
);

export default router;