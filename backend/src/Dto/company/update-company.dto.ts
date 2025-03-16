import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty({ description: 'Новое описание компании', example: 'Разработка инновационных технологий' })
  description: string;

  @ApiProperty({ description: 'Отрасль компании', example: 'IT' })
  industry: string;

  @ApiProperty({ description: 'Город расположения', example: 'Санкт-Петербург' })
  city: string;

  @ApiProperty({ description: 'Улица и номер дома', example: 'Невский проспект, 24' })
  street: string;

  @ApiProperty({ description: 'Контактный телефон', example: '+7 (812) 987-65-43' })
  phone: string;

  @ApiProperty({ description: 'Email компании', example: 'contact@techcorp.com' })
  email: string;

  @ApiProperty({ description: 'Веб-сайт компании', example: 'https://techcorp.com' })
  webSite: string;
}
