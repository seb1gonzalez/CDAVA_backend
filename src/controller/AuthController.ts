import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User }  from "../entity/User" ;
import config from "../config/config";


class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;

    if(!username){
        res.status(400).send("Username empty"); 
    }
    if (!password){
        res.status(400).send("Password empty");
    } 
    
    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    //console.log(await userRepository.find())
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(500).send("Internal Error. Credentials not found");
      return
    }
    
    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(400).send("Password Not Valid");
      return;
    }
    let t = new Date()
    await userRepository.update(user.id,{updatedAt:t})

    //Sing JWT, valid for 12 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role,dt: t.getTime() },
      config.jwtSecret,
      { expiresIn: "12h" }
    );
    
    await userRepository.update(user.id,{logoutActive:false})

    // MapFiltersController.user = user.username // this is unsafe
    //Send the jwt in the response
    res.status(201).send({"jwt_token":token,"username":user.username,"group":user.role,"userid":user.id});
  };

  static logout = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;
    
    
    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    //console.log(await userRepository.find())
    try {
      user = await userRepository.findOneOrFail(id);
     
      await userRepository.update(user.id,{logoutActive:true})

    } catch (error) {
      res.status(500).send("User not found");
    }
    
    res.status(200).send("Logout Sucess. Key purged. Login to get a new key.");
  };
 
  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send("OLD and NEW passwords are required");
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(400).send("Unknown Error.. No user.");
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(400).send("Incorrect Old Password");
      return; 
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(201).send("Password Changed");
  };

  static changePasswordAdmin = async (req: Request, res: Response) => {
    

    //Get parameters from the body
    //console.log(req.body)
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(500).send("Internal Error");
    }

    //Validate de model (password lenght)
    user.password = password;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.send({'user':"user"});
  };
}
export default AuthController;