import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateIncidentDto {
  @ApiPropertyOptional({ example: 'Torno CNC 01' })
  @IsOptional()
  @IsString()
  machineName?: string;

  @ApiPropertyOptional({ example: 'Falha mecânica' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Rolamento do eixo quebrado' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Alta', description: 'Baixa | Média | Alta | Crítica' })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ example: 'Corretiva', description: 'Corretiva | Preventiva | Preditiva' })
  @IsOptional()
  @IsString()
  typeOfOccurrence?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isMachineStopped?: boolean;

  @ApiPropertyOptional({ example: 'Em Aberto', description: 'Em Aberto | Em Andamento | Concluído' })
  @IsOptional()
  @IsString()
  status?: string;
}
