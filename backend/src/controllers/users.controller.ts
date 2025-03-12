import { UserDocument } from "./../schemas/user.schema";
import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { UpdateUserDto } from "src/Dto/user/update-user.dto";
import { UserRole } from "src/enums/user-role.enum";
import { UsersService } from "src/services/users.service";

@Controller("users")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  @Roles(UserRole.User, UserRole.Company)
  async getUserById(
    @Param("userId") userId: string
  ): Promise<UserDocument | null> {
    return this.usersService.getById(userId);
  }

  @Put(":userId")
  async updateUser(@Param("userId") userId: string, @Body() userDto: UpdateUserDto) {
    return this.usersService.update(userId, userDto);
  }
}
