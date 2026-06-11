import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEstudianteDto {
  @ApiProperty({ example: 'Juan Perez', description: 'El nombre del estudiante' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '2024001', description: 'El código único del estudiante' })
  @IsString()
  @IsNotEmpty()
  codigo: string;
}
