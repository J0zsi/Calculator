import selectors from '../support/selectors';


describe('Calculator Page', () => {
    beforeEach(() => {
        cy.visit('/')
    })


    it('should display the calculator', () => {
        cy.get(selectors.calc);
        cy.get(selectors.calcTop);
        cy.get(selectors.calcScreen);
        cy.get(selectors.calcScreenLine).should('have.length', 2);
        cy.get(selectors.calcScreenLineResult);
        cy.get(selectors.calcScreenLineExpression);
        cy.get(selectors.calcBtns)
          .children('button')
          .should('have.class', 'calc__btn')
          .should('have.length', 15)
          .should((buttons) => {
              const neededTextsOfButtons = '0123456789–+=C←'.split('');
              const textsOfButtons = [ ...buttons].map(button => button.textContent);
              
              expect(textsOfButtons).to.have.same.members(neededTextsOfButtons);
          });
    });


    describe('Calculator Functionality', () => {
        const INITIAL_RESULT = '';
        const INITIAL_EXPRESSION = '0';
        

        describe('Number Buttons', () => {

            it('should replace the last token of the expression if it is "0"', () => {
                cy.get(selectors.calcBtns).contains('1').click();
                cy.get(selectors.calcBtns).contains('+').click();
                cy.get(selectors.calcBtns).contains('5').click();
                cy.get(selectors.calcBtns).contains('6').click();
                cy.get(selectors.calcBtns).contains('–').click();
                cy.get(selectors.calcBtns).contains('0').click();

                cy.get(selectors.calcBtns).contains('7').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+56-7');
            });

            it('should append the number to the expression', () => {
                cy.get(selectors.calcBtns).contains('1').click();
                cy.get(selectors.calcBtns).contains('+').click();

                cy.get(selectors.calcBtns).contains('5').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+5');

                cy.get(selectors.calcBtns).contains('6').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+56');
            });

        });

        describe('Operator Buttons', () => {

            it('should not change the expression if it has the initial value', () => {
                cy.get(selectors.calcBtns).contains('+').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', INITIAL_EXPRESSION);

                cy.get(selectors.calcBtns).contains('–').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', INITIAL_EXPRESSION);
            });


            it('should replace the last character of the expression if it is an operator', () => {
                cy.get(selectors.calcBtns).contains('1').click();
                cy.get(selectors.calcBtns).contains('+').click();
                cy.get(selectors.calcBtns).contains('5').click();
                cy.get(selectors.calcBtns).contains('–').click();

                cy.get(selectors.calcBtns).contains('–').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+5-');

                cy.get(selectors.calcBtns).contains('+').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+5+');
            });


            it('should append the operator to the expression', () => {
                cy.get(selectors.calcBtns).contains('1').click();
                cy.get(selectors.calcBtns).contains('+').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+');

                cy.get(selectors.calcBtns).contains('5').click();
                cy.get(selectors.calcBtns).contains('6').click();
                cy.get(selectors.calcBtns).contains('–').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+56-');
            });
        
        });


        describe('Equals Button', () => {

            it('should not change the expression if its last character is an operator', () => {
                cy.get(selectors.calcBtns).contains('1').click();
                cy.get(selectors.calcBtns).contains('+').click();

                cy.get(selectors.calcBtns).contains('=').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1+');
            });


            it('should show the result and the expression', () => {
                cy.get(selectors.calcBtns).contains('1').click();
                cy.get(selectors.calcBtns).contains('+').click();
                cy.get(selectors.calcBtns).contains('5').click();

                cy.get(selectors.calcBtns).contains('=').click();
                cy.get(selectors.calcScreenLineResult)
                  .should('have.text',  '1+5=6');
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', INITIAL_EXPRESSION);
            });

        });


        describe('Delete Button', () => {

            it('should reset the expression to its initial value if its length is 1', () => {
                cy.get(selectors.calcBtns).contains('1').click();

                cy.get(selectors.calcBtns).contains('←').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', INITIAL_EXPRESSION);
            });

            it('should delete the last character of the expression', () => {
                cy.get(selectors.calcBtns).contains('1').click()
                cy.get(selectors.calcBtns).contains('8').click();
                
                cy.get(selectors.calcBtns).contains('←').click();
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', '1');
            });

        });


        describe('Clear Button', () => {

            it('should reset the calculator to the initial state', () => {
                cy.get(selectors.calcBtns).contains('2').click();
                cy.get(selectors.calcBtns).contains('0').click();
                cy.get(selectors.calcBtns).contains('+').click();
                cy.get(selectors.calcBtns).contains('4').click();
                cy.get(selectors.calcBtns).contains('4').click();
                cy.get(selectors.calcBtns).contains('=').click();

                cy.get(selectors.calcBtns).contains('C').click();
                cy.get(selectors.calcScreenLineResult)
                  .should('have.text',  INITIAL_RESULT);
                cy.get(selectors.calcScreenLineExpression)
                  .should('have.text', INITIAL_EXPRESSION);
            });

        });

    });
    
});