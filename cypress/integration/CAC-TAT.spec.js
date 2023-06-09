// CAC-TAT.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
/// <reference types="Cypress" />


beforeEach(() => {
    cy.visit('./src/index.html')
  })
describe('Central de Atendimento ao Cliente TAT', function() {
    it('verifica o título da aplicação', function() {  
        cy.title().should('equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function(){
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

  })
describe('Preenche os campos obrigatórios e envia o formulário', function() {
    it('preenche os campos obrigatórios e envia o formulário', function(){  
        cy.get('#firstName').type('Igor', {delay: 0})
        cy.get('#lastName').type('Fernandes', {delay: 0})
        cy.get('#email').type('igor@fernandes.com', {delay: 0})
        cy.get('#open-text-area').type('testandooo esse campo de texto', {delay: 0})
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })
  })
  describe('Valida mensagens', function() {
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {  
        cy.get('#firstName').type('Igor', {delay: 0})
        cy.get('#lastName').type('Fernandes', {delay: 0})
        cy.get('#email').type('igorfernandes.com', {delay: 0})
        cy.get('#open-text-area').type('testandooo esse campo de texto', {delay: 0})
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')

    })
    it('campo telefone não aceita letra', function() {  
        cy.get('#phone').type('Igor', {delay: 0})
        cy.get('#phone').should('have.value', '')
    })
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {  
        cy.clock()
        cy.get('#firstName').type('Igor', {delay: 0})
        cy.get('#lastName').type('Fernandes', {delay: 0})
        cy.get('#email').type('igor@fernandes.com', {delay: 0})
        cy.get('#open-text-area').type('testandooo esse campo de texto', {delay: 0})
        cy.get('input[type="checkbox"][value="phone"]').check()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {  
        cy.get('#firstName').type('Igor', {delay: 0}).should('have.value', 'Igor')
        .clear().should('have.value', '')
        cy.get('#lastName').type('Fernandes', {delay: 0}).should('have.value', 'Fernandes')
        .clear().should('have.value', '')
        cy.get('#email').type('Igor@fernandes.com', {delay: 0}).should('have.value', 'Igor@fernandes.com')
        .clear().should('have.value', '')
        cy.get('#phone').type('123', {delay: 0}).should('have.value', '123')
        .clear().should('have.value', '')
    })
    Cypress._.times(10, () =>{
        it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {  
            cy.clock()
            cy.contains('button', 'Enviar').click()
            cy.get('.error').should('be.visible')
            cy.tick(3000)
            cy.get('.error').should('not.be.visible')
    
        })
    } )   
   
    
    it('envia o formuário com sucesso usando um comando customizado', function() {  
        cy.fillMandatoryFieldsAndSubmit('Igor', 'Fernandes', 'igor@fernandes.com', 'testando testando teste')
    })
    it('seleciona um produto (YouTube) por seu texto', function() {  
        cy.get('#product').select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {  
        cy.get('#product').select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('eleciona um produto (Blog) por seu índice', function() {  
        cy.get('#product').select(1)
        .should('have.value', 'blog')
    })
    it('marca o tipo de atendimento "Feedback"', function() {  
        cy.get('input[value=feedback]').check()
        .should('be.checked')
    })
    it('marca cada tipo de atendimento', function() {  
        cy.get('input[type=radio]').should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })
    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type=checkbox]')
            .should('have.length', 2)
            .each(function(checkbox){
                cy.wrap(checkbox).check()
                cy.wrap(checkbox).should('be.checked')
        })
        .then(() => {
            cy.get('input[type=checkbox]')
                .last()
                .uncheck()
                .should('not.be.checked')
        })
    })
    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('#file-upload').selectFile('cypress/fixtures/example.json')
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('#file-upload').selectFile('cypress/fixtures/example.json', {action: "drag-drop"})
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json', { encoding: null }).as('MeuUpload')
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('@MeuUpload')
            .should(function(input){
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })


    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('a[href="privacy.html"]').invoke('removeAttr', 'target').click()
        cy.url().should('include', '/privacy')
    })

    it('preenche a area de texto usando o comando invoke', function(){
        const textoLongo = Cypress._.repeat('Abcdefg', 12)
        cy.get('#open-text-area')
            .invoke('val', textoLongo)
            .should('have.value', textoLongo)
    })

    it('faz uma requisição HTTP', function(){
        cy.request('GET', 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').then((Response)=>{
            expect(Response.status).to.equal(200)
            expect(Response.statusText).to.equal('OK')
            expect(Response.body).to.contain('CAC TAT')
        })
    })
    it('--------faz uma requisição HTTP', function(){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response){
                expect(response.status).to.equal(200)
                expect(response.statusText).to.equal('OK')
                expect(response.body).to.include('CAC TAT')
            })
        })
        it.only('encontrando o gato', function(){
            cy.get('#cat')
                .should('not.be.visible')
                .invoke('show')
                .should('be.visible')
            
        })
  })