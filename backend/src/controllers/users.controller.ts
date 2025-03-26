import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserDocument } from "./../schemas/user.schema";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { UpdateUserDto } from "src/dto/user/update-user.dto";
import { UserRole } from "src/enums/user-role.enum";
import { UsersService } from "src/services/users.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  @Roles(UserRole.User, UserRole.Company)
  @ApiOperation({ summary: "Get user by id" })
  @ApiParam({
    name: "userId",
    example: "67cc65984fbf60c02a6c91cb",
    description: "User id",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok." })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found." })
  async getUserById(
    @Param("userId") userId: string
  ): Promise<UserDocument | null> {
    return this.usersService.getById(userId);
  }

  @Put(":userId")
  @Roles(UserRole.Company, UserRole.User)
  @ApiOperation({ summary: "Update user by id" })
  @ApiParam({
    name: "userId",
    example: "67cc65984fbf60c02a6c91cb",
    description: "ID пользователя",
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok." })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found." })
  async updateUser(
    @Param("userId") userId: string,
    @Body() userDto: UpdateUserDto
  ) {
    return this.usersService.update(userId, userDto);
  }
}
