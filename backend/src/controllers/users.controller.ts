import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { UserRole } from "src/enums/user-role.enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles-auth.guard";
import { User } from "src/schemas/user.schema";
import { UsersService } from "src/services/users.service";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  @Roles(UserRole.User)
  async getUserById(@Param("userId") userId: string): Promise<User | null> {
    return this.usersService.getById(userId);
  }
}
