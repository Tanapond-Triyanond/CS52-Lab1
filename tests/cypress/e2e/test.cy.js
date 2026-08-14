const getNavLinks = () => cy.get('[data-cy="nav-link"][data-nav-target]');
const getSection = (id) => cy.get(`[data-section-id="${id}"]`);
const getHeroCta = () => cy.get('[data-cy="hero-cta"][data-scroll-target]');
const getLeadForm = () => cy.get('[data-cy="lead-form"]');
const getLeadStatus = () => cy.get('[data-cy="form-status"]');
const getSubmitButton = () => getLeadForm().find('button[type="submit"]');
const toggleMobileNav = () => cy.get('[data-cy="mobile-nav-toggle"]');
const primaryNav = () => cy.get('[data-cy="primary-nav"]');

describe('Landing page visitor journeys', () => {
  beforeEach(() => {
    cy.visit('index.html');
  });

  it('lets visitors jump between sections using the global navigation', () => {
    getNavLinks()
      .should('have.length.at.least', 3)
      .each(($link) => {
        const target = $link.getAttribute('data-nav-target');
        expect(target, 'nav link data-nav-target').to.match(/^[\w-]+$/);

        cy.wrap($link).click();
        cy.location('hash').should('eq', `#${target}`);
        getSection(target).should('be.visible');
      });
  });

  it('scrolls to the lead form when the hero call-to-action is pressed', () => {
    getHeroCta().then(($cta) => {
      const target = $cta.attr('data-scroll-target');
      expect(target, 'hero CTA scroll target').to.match(/^[\w-]+$/);

      cy.wrap($cta).click();
      cy.location('hash').should('eq', `#${target}`);
      cy.window().its('scrollY').should('be.greaterThan', 0);
      getSection(target)
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="lead-form"]').should('exist');
        });
    });
  });

  it('validates lead form submissions before showing a success message', () => {
    getSubmitButton().click();
    getLeadStatus().should('have.attr', 'data-status', 'error');

    getLeadForm().within(() => {
      cy.get('input[name="name"]').type('Visitor Van Fleet');
      cy.get('input[type="email"]').type('visitor@example.com');
      cy.get('textarea[name="message"]').type('Excited to learn more!');
    });

    getSubmitButton().click();
    getLeadStatus().should('have.attr', 'data-status', 'success');
  });

  it('provides a mobile navigation toggle that reflects its expanded state', () => {
    cy.viewport('iphone-x');
    cy.visit('index.html');

    toggleMobileNav()
      .should('have.attr', 'aria-expanded', 'false');
    primaryNav().should('have.attr', 'aria-hidden', 'true');

    toggleMobileNav().click();
    toggleMobileNav().should('have.attr', 'aria-expanded', 'true');
    primaryNav().should('have.attr', 'aria-hidden', 'false');

    toggleMobileNav().click();
    toggleMobileNav().should('have.attr', 'aria-expanded', 'false');
    primaryNav().should('have.attr', 'aria-hidden', 'true');
  });
});
