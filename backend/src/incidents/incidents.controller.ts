import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentDto } from './dto/incident.dto';
import { IncidentConnectionDto } from './dto/incident-connection.dto';
import { IncidentsService } from './incidents.service';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new incident' })
  @ApiBody({ type: CreateIncidentDto })
  @ApiCreatedResponse({ type: IncidentDto })
  create(@Body() createIncidentDto: CreateIncidentDto): Promise<IncidentDto> {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List incidents with optional filters and pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'machineName', required: false, type: String })
  @ApiQuery({ name: 'typeOfOccurrence', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiOkResponse({ type: IncidentConnectionDto })
  findAll(
    @Query('limit') limit = 10,
    @Query('machineName') machineName?: string,
    @Query('typeOfOccurrence') typeOfOccurrence?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<IncidentConnectionDto> {
    return this.incidentsService.findAll(
      Number(limit),
      machineName,
      typeOfOccurrence,
      search,
      status,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing incident' })
  @ApiParam({ name: 'id', description: 'Incident ID' })
  @ApiBody({ type: UpdateIncidentDto })
  @ApiOkResponse({ type: IncidentDto })
  update(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ): Promise<IncidentDto> {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an incident' })
  @ApiParam({ name: 'id', description: 'Incident ID' })
  @ApiOkResponse({ type: IncidentDto })
  remove(@Param('id') id: string): Promise<IncidentDto> {
    return this.incidentsService.remove(id);
  }
}
