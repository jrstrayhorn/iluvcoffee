import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest'; // highlevel abstraction for testing http requests
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
      .expect(200)
      .expect('Hello World!');
  });
});
