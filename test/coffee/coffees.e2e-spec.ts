import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from 'src/coffees/coffees.module';

// 3 choices for e2e database tests
// #1 - Mock Interactions with the Database (repositories and so forth) - lots of effort to maintain
// #2 - Use a Disk-Based Database like sqlite (fast, can swap the db connection keep code the same, but have to maintain and not the same as prod db)
// #3 - Add an Additional Testing Database (don't have to change any code), if using Docker this is a breeze by just adding a test db in docker compose
// then add some pre/post test script to spin up and tear down test db container with test runs

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3307,
          username: 'root',
          password: 'pass123',
          database: 'testdb',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // track tests that need to be done in the future
  it.todo('Create [POST /]');
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
