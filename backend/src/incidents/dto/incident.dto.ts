import { ApiProperty } from '@nestjs/swagger';

export class IncidentDto {
  @ApiProperty({ example: 'clxyz123' })
  id: string;

  @ApiProperty({ example: 'Torno CNC 01' })
  machineName: string;

  @ApiProperty({ example: 'Falha mecânica' })
  reason: string;

  @ApiProperty({ example: 'Rolamento do eixo quebrado' })
  description: string;

  @ApiProperty({ example: 'Alta' })
  severity: string;

  @ApiProperty({ example: 'Corretiva' })
  typeOfOccurrence: string;

  @ApiProperty({ example: true })
  isMachineStopped: boolean;

  @ApiProperty({ example: 'Em Aberto' })
  status: string;

  @ApiProperty({ example: '2024-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: null, required: false, nullable: true })
  finishedAt?: Date | null;
}
