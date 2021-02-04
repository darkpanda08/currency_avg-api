process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('API For Average Conversion Rate', () => {
    it('No Errors in Input', (done) => {
      chai.request(app)
          .get('/?currency=USD,CAD,GBP&fromdate=2021-02-01&todate=2021-02-02')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
            done();
          });
    });

    it('Wrong From Date Format', (done) => {
        chai.request(app)
            .get('/?currency=USD,CAD,GBP&fromdate=02-02-2011&todate=2021-02-02')
            .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body['Error'][0].should.equal("The From Date is not in format YYYY-MM-DD.");
              done();
            });
    });

    it('Wrong To Date Format', (done) => {
        chai.request(app)
            .get('/?currency=USD,CAD,GBP&fromdate=2021-02-01&todate=20-11-2015')
            .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body['Error'][0].should.equal("The To Date is not in format YYYY-MM-DD.");
              done();
            });
    });

    it('Currency not provided', (done) => {
        chai.request(app)
            .get('/?fromdate=2021-02-01&todate=2021-02-02')
            .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body['Error'][0].should.equal("Please provide atleast one currency.");
              done();
            });
    });

    it('Future To Date', (done) => {
        chai.request(app)
            .get('/?currency=USD,CAD,GBP&fromdate=2021-02-01&todate=2021-05-02')
            .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body['Error'][0].should.equal("The To Date should not be future date.");
              done();
            });
    });

    it('From Date before 2000-01-01', (done) => {
        chai.request(app)
            .get('/?currency=USD,CAD,GBP&fromdate=1999-01-01&todate=2020-02-02')
            .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body['Error'].should.equal("From Date should not be less than 2000-01-01");
              done();
            });
    });

    it('From Date greater than To Date', (done) => {
        chai.request(app)
            .get('/?currency=USD,CAD,GBP&fromdate=2020-04-01&todate=2020-02-02')
            .end((err, res) => {
                  res.should.have.status(422);
                  res.body.should.be.a('object');
                  res.body['Error'].should.equal("The To Date should be greater than From Date.");
              done();
            });
    });
});
