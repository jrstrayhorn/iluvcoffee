import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest'; // highlevel abstraction for testing http requests
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // instantiating the WHOLE app, everything!!! ideally we should test feature modules in isolation
    }).compile();

    // need to get an actual runtime environemnt
    // saving the running app
    app = moduleFixture.createNestApplication();
    await app.init(); // have to call this, to mount routes and lifecycle hooks
  });

  // http request using supertest
  it('/ (GET)', () => {
    return request(app.getHttpServer()) // passing reference to http listener either express or fastify
      .get('/')
      .set('Authorization', process.env.API_KEY)
      .expect(200)
      .expect('Hello Nest!');
  });

  afterAll(async () => {
    await app.close();
  });
});
