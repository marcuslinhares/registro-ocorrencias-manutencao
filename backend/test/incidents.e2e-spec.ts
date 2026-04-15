import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Incidents (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Clean up test data if needed
    // await prisma.incident.deleteMany({ where: { reason: 'E2E Test Reason' } });
    await app.close();
  });

  it('should create an incident via GraphQL mutation', () => {
    const createIncidentMutation = `
      mutation {
        createIncident(createIncidentInput: {
          machineName: "Torno CNC",
          reason: "E2E Test Reason",
          typeOfOccurrence: "Corretiva",
          severity: "Alta",
          isMachineStopped: true,
          description: "Description for E2E testing purposes"
        }) {
          id
          machineName
          reason
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createIncidentMutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createIncident).toBeDefined();
        expect(res.body.data.createIncident.machineName).toBe('Torno CNC');
        expect(res.body.data.createIncident.reason).toBe('E2E Test Reason');
      });
  });

  it('should list last incidents via GraphQL query', () => {
    const lastIncidentsQuery = `
      query {
        lastIncidents(limit: 5) {
          id
          machineName
          typeOfOccurrence
          status
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: lastIncidentsQuery })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.lastIncidents).toBeDefined();
        expect(Array.isArray(res.body.data.lastIncidents)).toBe(true);
      });
  });
});
