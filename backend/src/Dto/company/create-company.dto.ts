import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyDto {
  @ApiProperty({
    description: "ID пользователя, создающего компанию",
    example: "65f2c3d4e1a2b3c4d5e6f7g8",
  })
  userId: string;

  @ApiProperty({ description: "Название компании", example: "TechCorp" })
  name: string;

  @ApiProperty({
    description: "Описание компании",
    example: "Разработка программного обеспечения",
  })
  description: string;

  @ApiProperty({ description: "Отрасль компании", example: "IT" })
  industry: string;

  @ApiProperty({ description: "Город расположения", example: "Москва" })
  city: string;

  @ApiProperty({ description: "Улица и номер дома", example: "Ленина, 10" })
  street: string;

  @ApiProperty({
    description: "Контактный телефон",
    example: "+7 (999) 123-45-67",
  })
  phone: string;

  @ApiProperty({ description: "Email компании", example: "info@techcorp.com" })
  email: string;

  @ApiProperty({
    description: "Веб-сайт компании",
    example: "https://techcorp.com",
  })
  webSite: string;
}
