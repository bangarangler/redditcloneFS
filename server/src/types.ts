import { Request, Response } from "express";
import { Redis } from "ioredis";

interface SessionData {
  userId?: number;
}

export type MyContext = {
  req: Request & { session: SessionData };
  res: Response;
  redis: Redis;
};
