// Lab 1 — structural checks.
// These are FEEDBACK, not a grade. This lab is HTML + CSS only: no JS, no
// frameworks. So these tests check the structural things that are easy to
// forget — they say nothing about whether your page looks good.

const STYLESHEET = '../style.css';

describe('Lab 1 — landing page structure', () => {
  beforeEach(() => {
    cy.visit('index.html');
  });

  it('has the viewport meta tag, so media queries work on a real phone', () => {
    cy.get('head meta[name="viewport"]')
      .should('exist')
      .should('have.attr', 'content')
      .and('match', /width\s*=\s*device-width/);
  });

  it('links a stylesheet', () => {
    cy.get('head link[rel="stylesheet"]').should('exist');
  });

  it('uses semantic elements rather than divs for everything', () => {
    cy.get('nav').should('exist');
    cy.get('footer').should('exist');
    cy.get('header, main, section, article').should('have.length.at.least', 1);
  });

  it('has a nav with at least three links', () => {
    cy.get('nav a').should('have.length.at.least', 3);
  });

  it('has a call to action and a text input', () => {
    cy.get('button, input[type="submit"], [class*="cta"], [class*="btn"], [class*="button"]')
      .should('have.length.at.least', 1);
    cy.get('input').should('have.length.at.least', 1);
  });

  it('shows at least one image, as an <img> or a CSS background', () => {
    cy.window().then((win) => {
      const imgs = win.document.querySelectorAll('img').length;
      const backgrounds = [...win.document.querySelectorAll('body *')].filter(
        (el) => win.getComputedStyle(el).backgroundImage !== 'none',
      ).length;
      expect(imgs + backgrounds, '<img> tags or CSS background images').to.be.greaterThan(0);
    });
  });

  it('lays things out with flexbox', () => {
    cy.window().then((win) => {
      const flexed = [...win.document.querySelectorAll('body *')].filter(
        (el) => win.getComputedStyle(el).display === 'flex',
      );
      expect(flexed.length, 'elements with display: flex').to.be.greaterThan(0);
    });
  });

  it('has no JavaScript — this one is HTML and CSS only', () => {
    // Read the file, not the DOM: Cypress injects its own <script> into every
    // page it serves, so counting script tags in the DOM always finds one.
    cy.readFile('../index.html').then((html) => {
      expect(html, 'no <script> tags in index.html').not.to.match(/<script/i);
      expect(html, 'no inline event handlers (onclick=, onsubmit=, ...)').not.to.match(
        /\son[a-z]+\s*=/i,
      );
    });
  });

  it('has a mobile breakpoint and some hover polish in the CSS', () => {
    cy.readFile(STYLESHEET).then((css) => {
      expect(css, 'a media query with a max-width').to.match(/@media[^{]*max-width/);
      expect(css, 'at least one :hover rule').to.match(/:hover/);
    });
  });
});
