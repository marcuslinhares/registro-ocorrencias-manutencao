import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentInput } from './dto/create-incident.input';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    incident: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an incident', async () => {
      const input: CreateIncidentInput = {
        machineName: 'Machine A',
        reason: 'Broken belt',
        description: 'Belt needs replacement',
        severity: 'Alta',
        typeOfOccurrence: 'Corretiva',
        isMachineStopped: true,
      };

      const expectedResult = {
        id: '1',
        ...input,
        status: 'Em Aberto',
        createdAt: new Date(),
      };

      mockPrismaService.incident.create.mockResolvedValue(expectedResult);

      const result = await service.create(input);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.incident.create).toHaveBeenCalledWith({
        data: { ...input },
      });
    });
  });

  describe('findAll', () => {
    it('should return incidents with default limit', async () => {
      const expectedIncidents = [
        {
          id: '1',
          machineName: 'Machine A',
          reason: 'Test',
          description: 'Test desc',
          severity: 'Alta',
          typeOfOccurrence: 'Corretiva',
          isMachineStopped: false,
          status: 'Em Aberto',
          createdAt: new Date(),
        },
      ];

      mockPrismaService.incident.findMany.mockResolvedValue(expectedIncidents);

      const result = await service.findAll();

      expect(result).toEqual(expectedIncidents);
      expect(mockPrismaService.incident.findMany).toHaveBeenCalledWith({
        where: {},
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return incidents with custom limit', async () => {
      mockPrismaService.incident.findMany.mockResolvedValue([]);

      const result = await service.findAll(10);

      expect(result).toEqual([]);
      expect(mockPrismaService.incident.findMany).toHaveBeenCalledWith({
        where: {},
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
