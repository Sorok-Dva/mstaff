const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const User = require('../../orm/models').User;
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('# ORM User Model - CRUD Operations', () => {
  describe('Create User Operation', () => {
    before(done => {
      User.destroy({ truncate: { cascade: true } })
        .then(() => done(null))
        .catch(error => done(error));
    });
    it('should return a new user object', (done) => {
      User.create({
        firstName: 'Sorok',
        lastName: 'Dva',
        email: 'sorok.dva@gmail.com',
        password: '42',
        birthday: new Date(),
        postal_code: '75000',
        town: 'Paris',
        phone: '+33602030507',
        type: 'candidate',
        key: 'anyRandomKey'
      }).then(user => {
        user.firstName.should.be.equal('Sorok');
        done();
      });
    });
  });

  describe('Read User Operation', () => {
    it('should return a user object', (done) => {
      User.findOne({where: { firstName: 'Sorok' }}).then(user => {
        user.firstName.should.be.equal('Sorok');
        done();
      });
    });
  });

  describe('Update User Operation', () => {
    it('should update and return a user object', (done) => {
      User.update({firstName: 'Сорок' }, {where: { firstName: 'Sorok' }}).then(user => {
        user[0].should.be.equal(1);
        done();
      });
    });
  });

  describe('Delete User Operation', () => {
    it('should delete a user', (done) => {
      User.destroy({where: { firstName: 'Сорок' }}).then(result => {
        result.should.be.equal(1);
        done();
      });
    });
  });
});