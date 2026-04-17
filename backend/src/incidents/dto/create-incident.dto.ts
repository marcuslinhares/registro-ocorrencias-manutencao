import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Torno CNC 01' })
  @IsNotEmpty()
  @IsString()
  machineName: string;

  @ApiProperty({ example: 'Falha mecânica' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ example: 'Rolamento do eixo quebrado' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Alta', description: 'Baixa | Média | Alta | Crítica' })
  @IsNotEmpty()
  @IsString()
  severity: string;

  @ApiProperty({ example: 'Corretiva', description: 'Corretiva | Preventiva | Preditiva' })
  @IsNotEmpty()
  @IsString()
  typeOfOccurrence: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isMachineStopped: boolean;
}
