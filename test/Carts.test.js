import supertest from 'supertest';
import { expect } from 'chai';


const request = supertest.agent('http://localhost:8000')

describe('Carts API', () => {
    it('Obtener todos los carritos', (done) => {
      request.get('/mongoose/carts')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          expect(res.status).to.equal(200);
  
          done();
        });
    });
  
    it('Obtener carrito por ID', (done) => {
      request.get('/mongoose/carts/12345')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          expect(res.status).to.equal(200);
  
          done();
        });
    });
  
    it('Crear carrito', (done) => {
      request.post('/mongoose/carts')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          expect(res.status).to.equal(200);
  
  
          done();
        });
    });
  
  });