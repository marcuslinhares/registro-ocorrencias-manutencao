import { ApiProperty } from '@nestjs/swagger';
import { IncidentDto } from './incident.dto';

export class IncidentConnectionDto {
  @ApiProperty({ type: [IncidentDto] })
  items: IncidentDto[];

  @ApiProperty({ example: 42 })
  totalCount: number;
}
