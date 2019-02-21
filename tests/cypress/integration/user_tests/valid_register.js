Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('register as new user', function () {
  it('register', function () {
    cy.visit('localhost:3000/register')
      .get('#firstName')
      .type('Johnny')
      .get('#lastName')
      .type('Doe')
      .get('#birthday')
      .type('1998-10-10')
      .get('#postal_code')
      .type('75017')
      .get('#town')
      .type('Paris')
      .get('#phone')
      .type('0612345678')
      .get('#email')
      .type('johnny@doe.net')
      .get('#password')
      .type('password123')
      .get('form').find('button').contains('inscrire').click()
  })
})
