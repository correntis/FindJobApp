import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    description: "Email пользователя",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Телеграмм пользователя",
    example: "@username",
  })
  telegram: string;

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
}
