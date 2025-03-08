import { Injectable } from "@nestjs/common";
import { UsersRepository } from "src/repositories/users.repository";
import { User } from "src/schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getById(userId: string): Promise<User | null> {
    return this.usersRepository.findById(userId);
  }
}
