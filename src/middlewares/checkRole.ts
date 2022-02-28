import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;
    const dt = res.locals.jwtPayload.dt
    const role = res.locals.jwtPayload.role
    console.log(role)

    //Get user role from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
      console.log(dt,user.updatedAt.getTime(),dt < user.updatedAt.getTime())
      if (user.logoutActive || dt < user.updatedAt.getTime()){
        res.status(401).send("Please login");
        return
      }
      
    } catch (id) {
      console.log(id)
      res.status(401).send("User not found");
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(role) > -1) next();
    else res.status(401).send("Role not allowed");
  };
};