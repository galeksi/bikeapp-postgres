describe('Bikeapp', () => {
  it('front page can be opened', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Stations');
  });

  beforeEach(function () {
    cy.visit('http://localhost:3000/');
  });

  describe('main pages can be visited', () => {
    it('trips can be opened', () => {
      cy.contains('TRIPS').click();
      cy.wait(5000);
      cy.contains('Trips');
    });

    it('stations can be opened', () => {
      cy.contains('TRIPS').click();
      cy.wait(5000);
      cy.contains('Trips');
      cy.contains('STATIONS').click();
      cy.contains('Stations');
    });
  });

  describe('trips page', () => {
    it('trips are shown and paginated', () => {
      cy.visit('http://localhost:3000/trips');
      cy.wait(5000);
      cy.contains('Pasilan asema');
      cy.contains('forward').click();
      cy.contains('Vilhonvuorenkatu');
    });
    it('trips can be filtered', () => {
      cy.visit('http://localhost:3000/trips');
      cy.wait(5000);
      cy.get('#departurestation').click().type('Keilalahti{enter}');
      cy.get('#returnstation').click().type('Tapionaukio{enter}');
      cy.get('#datepicker').click().type('2021-07-27{enter}');
      cy.get('#tripfilterbutton').click();
      cy.wait(5000);
      cy.contains('10:45');
    });
  });

  describe('stations page', () => {
    it('stations are shown and paginated', () => {
      cy.contains('forward').click();
      cy.contains('Maarinranta');
    });

    it('stations can be searched', () => {
      cy.get('#stationsearch').click().type('Lepo');
      cy.get('#stationsearchbutton').click();
      cy.contains('Lepolantie 61');
    });
  });

  describe('station detail page', () => {
    it('station view is shown', () => {
      cy.contains('View').click();
      cy.wait(1500);
      cy.contains('Most popular return stations');
    });
  });
});
