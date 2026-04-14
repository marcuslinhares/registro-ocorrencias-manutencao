import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class CreateIncidentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  machineName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  reason: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  severity: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  typeOfOccurrence: string;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isMachineStopped: boolean;
}
