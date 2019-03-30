const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('# Express Routes - Status [SECURITY CHECK]', () => {
  describe('/GET back-office/ when user not logged', () => {
    it('should return NOT_FOUND status', (done) => {
      chai.request(app)
        .get('/back-office')
        .end((err, res) =>{
          res.should.have.status(404);
          done()
        })
    });
  });
});