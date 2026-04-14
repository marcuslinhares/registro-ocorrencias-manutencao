import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentInput } from './dto/create-incident.input';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createIncidentInput: CreateIncidentInput) {
    return this.prisma.incident.create({
      data: {
        ...createIncidentInput,
      },
    });
  }

  async findAll(limit: number = 5) {
    return this.prisma.incident.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
