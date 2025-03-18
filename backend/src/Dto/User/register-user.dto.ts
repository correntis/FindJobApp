import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
  @ApiProperty({
    description: "Имя пользователя",
    example: "John",
  })
  firstName: string;

  @ApiProperty({
    description: "Фамилия пользователя",
    example: "Doe",
  })
  lastName: string;

  @ApiProperty({
    description: "Email пользователя",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Пароль пользователя",
    example: "string",
  })
  password: string;

  @ApiProperty({
    description: "Роль пользователя",
    example: "User",
  })
  role: string;
}
