import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { User } from "src/schemas/user.schema";
import { UsersService } from "src/services/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  async getUserById(@Param("userId") userId: string): Promise<User | null> {
    return this.usersService.getById(userId);
  }
}
