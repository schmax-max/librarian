const chai = require('chai')
const mongoose = require('mongoose')
const chaiAsPromised = require('chai-as-promised')
const expect = require('chai').expect
const should = require('chai').should()
chai.use(chaiAsPromised).should()

require ('../config/connection')
const {commander} = require ('../svc/commander')
const {body} = require ('./data')

beforeEach(async () => {
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error'))
    db.once('open', () => {
        console.log('test DB connected!')
    })
});
  
const defaultTimeout = 60 * 1000 

describe('TEST: .... ||', () => {
    it('...', async () => { 
        const response = await commander(body)
        // expect(response).to.have.nested.property('mbfc')
        // expect(response).to.have.nested.property('mbfc.bubble')
    }).timeout(defaultTimeout)
})
