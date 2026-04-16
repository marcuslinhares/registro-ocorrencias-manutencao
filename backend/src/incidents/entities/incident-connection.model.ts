import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Incident } from './incident.model';

@ObjectType()
export class IncidentConnection {
  @Field(() => [Incident])
  items: Incident[];

  @Field(() => Int)
  totalCount: number;
}
