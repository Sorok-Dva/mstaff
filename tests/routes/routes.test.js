const assert = require('assert');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('# Express Routes', () => {
  describe(' - / [GET]', () => {
    it('should return OK status', () => {
      return request(app)
        .get('/')
        .then(response =>{
          assert.strictEqual(response.status, 200)
        })
    });

    it('should render landing layout template', () => {
      return request(app)
        .get('/')
        .then(response => {
          expect(response.text).to.contain('Mstaff vous accompagne dans la gestion de vos candidatures.');
        })
    });
  });

  describe(' - /login [GET]', () => {
    it('should return OK status', () => {
      return request(app)
        .get('/login')
        .then(response =>{
          assert.strictEqual(response.status, 200)
        })
    });

    it('should render login form', () => {
      return request(app)
        .get('/login')
        .then(response => {
          expect(response.text).to.contain('<form action="/login" method="post">');
        })
    });
  });

  describe('[API]', () => {
    describe(' - /api/ [GET]', () => {
      it('should return OK status', () => {
        return request(app)
          .get('/api/')
          .then(response =>{
            assert.strictEqual(response.status, 200)
          })
      });

      it('should return "welcome" message', () => {
        return request(app)
          .get('/api/')
          .then(response => {
            expect(response.text).to.contain('welcome');
          })
      });
    });
    describe(' - /api/skills/all [GET]', () => {
      it('should return OK status', () => {
        return request(app)
          .get('/api/skills/all')
          .then(response =>{
            assert.strictEqual(response.status, 200)
          })
      });

      it('should return skills object', () => {
        return request(app)
          .get('/api/skills/all')
          .then(response => {
            expect(response.body).to.include.keys('skills');
          })
      });
    });

    describe(' - /api/groups/all [GET]', () => {
      it('should return OK status', () => {
        return request(app)
          .get('/api/groups/all')
          .then(response =>{
            assert.strictEqual(response.status, 200)
          })
      });

      it('should return groups object', () => {
        return request(app)
          .get('/api/groups/all')
          .then(response => {
            expect(response.body).to.include.keys('groups');
          })
      });
    });

    describe(' - /api/equipments/all [GET]', () => {
      it('should return OK status', () => {
        return request(app)
          .get('/api/equipments/all')
          .then(response =>{
            assert.strictEqual(response.status, 200)
          })
      });

      it('should return equipments object', () => {
        return request(app)
          .get('/api/equipments/all')
          .then(response => {
            expect(response.body).to.include.keys('equipments');
          })
      });
    });

    describe(' - /api/softwares/all [GET]', () => {
      it('should return OK status', () => {
        return request(app)
          .get('/api/softwares/all')
          .then(response =>{
            assert.strictEqual(response.status, 200)
          })
      });

      it('should return softwares object', () => {
        return request(app)
          .get('/api/softwares/all')
          .then(response => {
            expect(response.body).to.include.keys('softwares');
          })
      });
    });

    describe(' - /api/establishments/all [GET]', () => {
      it('should return OK status', () => {
        return request(app)
          .get('/api/establishments/all')
          .then(response =>{
            assert.strictEqual(response.status, 200)
          })
      });

      it('should return establishments object', () => {
        return request(app)
          .get('/api/establishments/all')
          .then(response => {
            expect(response.body).to.include.keys('establishments');
          })
      });
    });

    describe(' - /api/categoriesPostsServices/all [GET]', () => {
      it('should return OK status', () => {
        return request(app)
          .get('/api/categoriesPostsServices/all')
          .then(response =>{
            assert.strictEqual(response.status, 200)
          })
      });

      it('should return categoriesPostsServices object', () => {
        return request(app)
          .get('/api/categoriesPostsServices/all')
          .then(response => {
            expect(response.body).to.include.keys('categories');
          })
      });
    });

  });
});