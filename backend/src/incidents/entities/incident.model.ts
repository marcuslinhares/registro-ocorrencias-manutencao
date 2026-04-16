import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Incident {
  @Field(() => ID)
  id: string;

  @Field()
  machineName: string;

  @Field()
  reason: string;

  @Field()
  description: string;

  @Field()
  severity: string;

  @Field()
  typeOfOccurrence: string;

  @Field()
  isMachineStopped: boolean;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  finishedAt?: Date;
}
