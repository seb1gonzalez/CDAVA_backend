import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import pbcatapi from "./pbcatapi";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/api", pbcatapi);

export default routes;