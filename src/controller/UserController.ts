import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";


class UserController{

static listAll = async (req: Request, res: Response) => {
  //Get users from database
  const userRepository = getRepository(User);
  const users = await userRepository.find({

  });

  //Send the users object
  res.send(users);
};

static getOneById = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id: number = req.params.id;
 

  //Get the user from database                                   
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail(id, {
      select: ["id", "username", "role"] //We dont want to send the password on response
    });
    res.status(201).send(user)
  } catch (error) {
    res.status(500).send("User not found");
  }
};

static newUser = async (req: Request, res: Response) => {
  //Get parameters from the body
  let { username, password, role } = req.body;
  let user = new User();
  user.username = username;
  user.password = password;
  user.role = role;

  //Validate if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Hash the password, to securely store on DB
  user.hashPassword();

  //Try to save. If fails, the username is already in use
  const userRepository = getRepository(User);
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("username already in use");
    return;
  }

  //If all ok, send 201 response
  res.send({'user':user});
};

static editUser = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id = req.params.id;

  //Get values from the body
  const { username, role } = req.body;

  //Try to find user on database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    //If not found, send a 500 response
    res.status(500).send("User not found");
    return;
  }

  //Validate the new values on model
  user.username = username;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("errror editing user");
    return;
  }
  //After all send a 204 (no content, but accepted) response
  res.send(user);
};


static deleteUser = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id = req.params.id;
  const userid = res.locals.jwtPayload.userId;
  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    res.status(500).send("User not found");
    return;
  }
  if (user.id===userid){
    res.status(500).send("Connot delete self... What are you doing?");
    return;
  }else{
    userRepository.delete(id);
  }

  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};
};

export default UserController;