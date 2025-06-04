import { Request } from "express";
import { JwtPayloadInterface } from "./jwt-payload.interface";

export interface RequestWithUserInterface extends Request {
  user: JwtPayloadInterface;
}
