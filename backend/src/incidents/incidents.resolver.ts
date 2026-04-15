import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IncidentsService } from './incidents.service';
import { Incident } from './entities/incident.model';
import { CreateIncidentInput } from './dto/create-incident.input';

@Resolver(() => Incident)
export class IncidentsResolver {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Mutation(() => Incident)
  async createIncident(
    @Args('createIncidentInput') createIncidentInput: CreateIncidentInput,
  ) {
    return this.incidentsService.create(createIncidentInput);
  }

  @Query(() => [Incident], { name: 'lastIncidents' })
  async findAll(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('machineName', { type: () => String, nullable: true }) machineName?: string,
    @Args('typeOfOccurrence', { type: () => String, nullable: true }) typeOfOccurrence?: string,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.incidentsService.findAll(limit, machineName, typeOfOccurrence, search);
  }
}
