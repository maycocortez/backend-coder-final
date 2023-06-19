import supertest from 'supertest';
import { expect } from 'chai';


const request = supertest.agent('http://localhost:8000')

describe('Products API', () => {
    it('Obtener todos los productos', (done) => {
      request.get('/mongoose/products')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          expect(res.status).to.equal(200);

  
          done();
        });
    });
  
    it('redirecciona a /api/session si no esta autenticado', (done) => {
      request.get('/mongoose/products')
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          expect(res.status).to.equal(302);
          expect(res.header.location).to.equal('/api/session');
  
          done();
        });
    });
  
    it('obtener todos los productos si esta autenticado', (done) => {

      const agent = supertest.agent(app);
      agent.post('/api/login')
        .send({ username: 'asdd@asdd.com', password: 'asd' })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          agent.get('/mongoose/products')
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
  

  
              done();
            });
        });
    });
  

  });