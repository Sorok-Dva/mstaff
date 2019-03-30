const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('# Express Routes - Status and content [BASE PAGES]', () => {
  describe('/GET Invalid Page (404)', () => {
    it('should return NOT_FOUND status', (done) => {
      chai.request(app)
        .get('/invalid/page')
        .end((err, res) =>{
          res.should.have.status(404);
          done()
        })
    });

    it('should show 404 error', (done) => {
      chai.request(app)
        .get('/invalid/page')
        .end((err, res) => {
          res.text.should.contain('Page Introuvable');
          done()
        })
    });
  });
  describe('/GET Landing Page', () => {
    it('should return OK status', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) =>{
          res.should.have.status(200);
          done()
        })
    });

    it('should render landing layout template', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) =>{
          res.text.should.contain('Mstaff vous accompagne dans la gestion de vos candidatures.');
          done()
        })
    });
  });

  describe('/GET login', () => {
    it('should return OK status', (done) => {
      chai.request(app)
        .get('/login')
        .end((err, res) =>{
          res.should.have.status(200);
          done()
        })
    });

    it('should render login form', (done) => {
      chai.request(app)
        .get('/login')
        .end((err, res) =>{
          res.text.should.contain('<form action="/login" method="post">');
          done()
        })
    });
  });

  describe('## [API] ROUTES', () => {
    describe('/GET api', () => {
      it('should return OK status', (done) => {
        chai.request(app)
          .get('/api/')
          .end((err, res) =>{
            res.should.have.status(200);
            done()
          })
      });

      it('should return "welcome" message', (done) => {
        chai.request(app)
          .get('/api/')
          .end((err, res) =>{
            res.text.should.contain('welcome');
            done()
          })
      });
    });

    describe('/GET api/skills/all', () => {
      it('should return OK status', (done) => {
        chai.request(app)
          .get('/api/skills/all')
          .end((err, res) =>{
            res.should.have.status(200);
            done()
          })
      });

      it('should return skills object', (done) => {
        chai.request(app)
          .get('/api/skills/all')
          .end((err, res) => {
            res.body.should.be.a('object');
            res.body.should.include.keys('skills');
            done()
          })
      });
    });

    describe('/GET api/groups/all', () => {
      it('should return OK status', (done) => {
        chai.request(app)
          .get('/api/groups/all')
          .end((err, res) =>{
            res.should.have.status(200);
            done()
          })
      });

      it('should return groups object', (done) => {
        chai.request(app)
          .get('/api/groups/all')
          .end((err, res) =>{
            res.body.should.be.a('object');
            res.body.should.include.keys('groups');
            done()
          })
      });
    });

    describe('/GET api/equipments/all', () => {
      it('should return OK status', (done) => {
        chai.request(app)
          .get('/api/equipments/all')
          .end((err, res) =>{
            res.should.have.status(200);
            done()
          })
      });

      it('should return equipments object', (done) => {
        chai.request(app)
          .get('/api/equipments/all')
          .end((err, res) => {
            res.body.should.be.a('object');
            res.body.should.include.keys('equipments');
            done()
          })
      });
    });

    describe('/GET api/softwares/all', () => {
      it('should return OK status', (done) => {
        chai.request(app)
          .get('/api/softwares/all')
          .end((err, res) =>{
            res.should.have.status(200);
            done()
          })
      });

      it('should return softwares object', (done) => {
        chai.request(app)
          .get('/api/softwares/all')
          .end((err, res) =>{
            res.body.should.be.a('object');
            res.body.should.include.keys('softwares');
            done()
          })
      });
    });

    describe(' - /api/establishments/all [GET]', () => {
      it('should return OK status', (done) => {
        chai.request(app)
          .get('/api/establishments/all')
          .end((err, res) => {
            res.should.have.status(200);
            done()
          })
      });

      it('should return establishments object', (done) => {
        chai.request(app)
          .get('/api/establishments/all')
          .end((err, res) => {
            res.body.should.be.a('object');
            res.body.should.include.keys('establishments');
            done()
          })
      });
    });

    describe(' - /api/categoriesPostsServices/all [GET]', () => {
      it('should return OK status', () => {
        chai.request(app)
          .get('/api/categoriesPostsServices/all')
          .end((err, res) => {
            res.should.have.status(200);
          })
      });

      it('should return categoriesPostsServices object', () => {
        chai.request(app)
          .get('/api/categoriesPostsServices/all')
          .end((err, res) => {
            res.body.should.be.a('object');
            res.body.should.include.keys('categories');
          })
      });
    });

  });
});