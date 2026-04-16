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

  async update(id: string, updateIncidentInput: any) {
    return this.prisma.incident.update({
      where: { id },
      data: updateIncidentInput,
    });
  }

  async remove(id: string) {
    return this.prisma.incident.delete({
      where: { id },
    });
  }

  async findAll(limit: number = 10, machineName?: string, typeOfOccurrence?: string, search?: string, status?: string) {
    const where: any = {};

    if (machineName) {
      where.machineName = machineName;
    }

    if (typeOfOccurrence) {
      where.typeOfOccurrence = typeOfOccurrence;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { machineName: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.incident.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
