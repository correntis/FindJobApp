import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "src/Dto/user/update-user.dto";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { UsersRepository } from "src/repositories/users.repository";
import { User, UserDocument } from "src/schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getById(userId: string): Promise<UserDocument> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(User);
    }

    return user;
  }

  async update(
    userId: string,
    user: UpdateUserDto
  ): Promise<UserDocument> {
    const updatedUser = await this.usersRepository.update(userId, user);

    if (!updatedUser) {
      throw new NotFoundException(User);
    }

    return updatedUser;
  }
}
