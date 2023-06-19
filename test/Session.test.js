import supertest from 'supertest';
import { expect } from 'chai';


const request = supertest.agent('http://localhost:8000')


describe('Session API', () => {
    it('Obtiene la session', (done) => {
        this.timeout(6000)
      request.get('/api/session')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          expect(res.status).to.equal(200);

  
          done();
        });
    });
  
    it('Loguear usuario', (done) => {
      request.post('/api/session/login')
        .send({ username: 'asdd@asdd.com', password: 'asd' })
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          expect(res.status).to.equal(302);
  
          done();
        });
    });
})