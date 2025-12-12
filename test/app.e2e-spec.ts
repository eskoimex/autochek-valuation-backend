
import { Test } from "@nestjs/testing";
import { APP_GUARD } from "@nestjs/core";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { AppDataSource } from "../ormconfig";
import { INestApplication } from "@nestjs/common";

let app: INestApplication;

beforeAll(async () => {
  process.env.DB_FILE = ":memory:";

  await AppDataSource.initialize();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    // override ANY guard globally
    .overrideProvider(APP_GUARD)
    .useValue({
      canActivate: () => true,
    })
    .compile();

  app = moduleRef.createNestApplication();

  await app.init();
});

afterAll(async () => {
  await app.close();
  await AppDataSource.destroy();
});


describe("App (e2e)", () => {
  it("vehicle -> valuation -> loan -> offer flow", async () => {
    const vin = "TESTVIN1234567890";

    // create vehicle
    const createRes = await request(app.getHttpServer())
      .post("/vehicles")
      .send({
        vin,
        make: "Test",
        model: "ModelX",
        year: 2020,
        mileage: 10000,
        price: 60000000,
        color: "Red",
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.vin).toBe(vin);

    // request valuation
    const valRes = await request(app.getHttpServer())
      .post("/valuations")
      .send({ vin });
    expect([200, 201]).toContain(valRes.status);
    expect(valRes.body.estimatedValue).toBeDefined();

    // submit loan
    const loanRes = await request(app.getHttpServer())
      .post("/loans")
      .send({
        vin,
        applicantName: "Tester",
        applicantAge: 30,
        requestedAmount: Math.round(valRes.body.estimatedValue * 0.5),
      });
    expect(loanRes.status).toBe(201);
    const loanId = loanRes.body.id;
    expect(loanId).toBeDefined();

    // create offer
    const offerRes = await request(app.getHttpServer()).post("/offers").send({
      loanId,
      apr: 10.5,
      termMonths: 24,
    });
    expect(offerRes.status).toBe(201);
    expect(offerRes.body.loanId).toBe(loanId);

    // list offers for loan
    const offersListRes = await request(app.getHttpServer())
      .get(`/offers/loan/${loanId}`)
      .send();
    expect(offersListRes.status).toBe(200);
    expect(Array.isArray(offersListRes.body)).toBe(true);
    expect(offersListRes.body.length).toBeGreaterThan(0);
  });
});
