import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PermissionInterface } from '../types/permission.interface';

export class PermissionDto implements PermissionInterface {
  @ApiProperty({
    description: 'Ресурс, к которому применяется разрешение',
    example: 'news',
    minLength: 1,
  })
  @IsString()
  resource!: string;

  @ApiProperty({
    description: 'Действие, которое разрешено',
    example: 'create',
    // enum: ['create', 'read', 'update', 'delete'],
  })
  @IsString()
  action!: string;
}
