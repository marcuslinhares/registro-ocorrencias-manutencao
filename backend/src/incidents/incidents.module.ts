import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { IncidentsResolver } from './incidents.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [IncidentsResolver, IncidentsService],
})
export class IncidentsModule {}
