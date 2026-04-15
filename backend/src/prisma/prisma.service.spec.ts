const mockConnect = jest.fn().mockResolvedValue(undefined);

jest.mock('@prisma/client', () => {
  class MockPrismaClient {
    $connect = mockConnect;
  }
  return { PrismaClient: MockPrismaClient };
});

import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PrismaService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect', async () => {
      await service.onModuleInit();

      expect(mockConnect).toHaveBeenCalled();
    });
  });
});
