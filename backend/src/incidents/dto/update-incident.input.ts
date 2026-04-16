import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateIncidentInput } from './create-incident.input';

@InputType()
export class UpdateIncidentInput extends PartialType(CreateIncidentInput) {
  @Field({ nullable: true })
  status?: string;
}
