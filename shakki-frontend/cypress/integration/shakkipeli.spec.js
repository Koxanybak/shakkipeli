/// <reference types="Cypress" />

describe("Shakkipeli", function() {
  beforeEach(function(){
    cy.visit("http://localhost:3000")
  })

  it("front page contains needed elements", function() {
    cy.contains("Student project for")
    cy.contains("Pelaa")
    cy.contains("Kirjaudu")
  })

  it("existing user can login", function() {
    cy.contains("Kirjaudu").click()
    cy.contains("Kirjaudu sisään")
    cy.get("#username").type("Koxanybak")
    cy.get("#password").type("shakkipeli11")
    cy.get("#login-button").click()

    cy.get("#profile-button")
  })

  describe("when logged in", function() {
    beforeEach(function() {
      cy.contains("Kirjaudu").click()
      cy.get("#username").type("Koxanybak")
      cy.get("#password").type("shakkipeli11")
      cy.get("#login-button").click()
    })

    it("profile drawer can be opened", function() {
      cy.get("#profile-button").click()
      cy.contains("Kirjautuneena Koxanybak")
    })

    describe("when profile drawer open", function() {
      beforeEach(function() {
        cy.reload()
        cy.get("#profile-button").click()
        cy.contains("Kirjautuneena Koxanybak")
      })

      /* it("friendRequest can be sent to non friend", function() {
        cy.contains("Lisää kaveri").click()
        cy.get("#add-friend-tag").type("uusi")
        cy.get("#friend-request-send").click()

        cy.contains("Kaveripyyntö lähetetty")
      }) */

      it("friendRequest can't be sent to friend", function() {
        cy.contains("Lisää kaveri").click()
        cy.get("#add-friend-tag").type("testi")
        cy.get("#friend-request-send").click()

        cy.contains("The users are already friends.")
      })
    })
  })
})