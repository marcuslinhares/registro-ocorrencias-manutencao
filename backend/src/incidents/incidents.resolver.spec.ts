import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsResolver } from './incidents.resolver';
import { IncidentsService } from './incidents.service';
import { CreateIncidentInput } from './dto/create-incident.input';

describe('IncidentsResolver', () => {
  let resolver: IncidentsResolver;
  let service: IncidentsService;

  const mockIncidentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsResolver,
        { provide: IncidentsService, useValue: mockIncidentsService },
      ],
    }).compile();

    resolver = module.get<IncidentsResolver>(IncidentsResolver);
    service = module.get<IncidentsService>(IncidentsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createIncident', () => {
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

      mockIncidentsService.create.mockResolvedValue(expectedResult);

      const result = await resolver.createIncident(input);

      expect(result).toEqual(expectedResult);
      expect(mockIncidentsService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('findAll', () => {
    it('should return incidents with given limit', async () => {
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

      mockIncidentsService.findAll.mockResolvedValue(expectedIncidents);

      const result = await resolver.findAll(5);

      expect(result).toEqual(expectedIncidents);
      expect(mockIncidentsService.findAll).toHaveBeenCalledWith(5);
    });
  });
});
