describe('Signal Zero Smoke Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the hotspot counter with discovery data', () => {
    cy.contains('Local Hotspots', { timeout: 20000 }).should('be.visible');
    
    cy.contains('discovered').should('be.visible');
    cy.contains('/').should('be.visible');
  });
});
