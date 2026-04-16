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
    update: jest.fn(),
    remove: jest.fn(),
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
        machineName: 'A',
        reason: 'R',
        description: 'D',
        severity: 'Alta',
        typeOfOccurrence: 'Corretiva',
        isMachineStopped: false,
      };
      const expectedResult = { id: '1', ...input, createdAt: new Date() };

      mockIncidentsService.create.mockResolvedValue(expectedResult);

      const result = await resolver.createIncident(input);

      expect(result).toEqual(expectedResult);
      expect(mockIncidentsService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('findAll', () => {
    it('should return incidents with given limit', async () => {
      const expectedIncidents = [{ id: '1', machineName: 'A', createdAt: new Date() }];
      const expectedResult = { items: expectedIncidents, totalCount: 1 };
      mockIncidentsService.findAll.mockResolvedValue(expectedResult);

      const result = await resolver.findAll(5);

      expect(result).toEqual(expectedResult);
      expect(mockIncidentsService.findAll).toHaveBeenCalledWith(5, undefined, undefined, undefined, undefined);
    });
  });

  describe('updateIncident', () => {
    it('should update an incident', async () => {
      const id = '1';
      const input = { reason: 'Updated' };
      const expectedResult = { id, machineName: 'A', ...input, createdAt: new Date() };

      mockIncidentsService.update.mockResolvedValue(expectedResult);

      const result = await resolver.updateIncident(id, input);

      expect(result).toEqual(expectedResult);
      expect(mockIncidentsService.update).toHaveBeenCalledWith(id, input);
    });
  });

  describe('deleteIncident', () => {
    it('should delete an incident', async () => {
      const id = '1';
      const expectedResult = { id, machineName: 'A', createdAt: new Date() };

      mockIncidentsService.remove.mockResolvedValue(expectedResult);

      const result = await resolver.deleteIncident(id);

      expect(result).toEqual(expectedResult);
      expect(mockIncidentsService.remove).toHaveBeenCalledWith(id);
    });
  });
});
