import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CalculatorComponent } from './calculator.component';
import { ExpressionService } from './services/expression.service';
import { selectors, getButtonByTextContent } from './test-utils';


describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let debugElement: DebugElement;
  let expressionService: any;

  
  beforeEach(waitForAsync(async () => {

    const expressionServiceSpy = jasmine.createSpyObj('ExpressionService', [
      'isLastTokenEqualToZero',
      'replaceLastCharacter',
      'isLastCharacterAnOperator',
      'evaluate'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ CalculatorComponent ],
      providers: [
          {provide: ExpressionService, useValue: expressionServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    expressionService = TestBed.inject(ExpressionService);
    fixture.detectChanges();

  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Number Buttons', () => {

    it('should replace the last token of the expression if it is "0"', () => {
      expressionService.isLastTokenEqualToZero.and.returnValue(true);
      expressionService.replaceLastCharacter.and.returnValue('20+30-5');
  
      component.expression = '20+30-0';
      
      getButtonByTextContent(debugElement, '5')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe('20+30-5');

    });

    it('should append the number to the expression', () => {
      expressionService.isLastTokenEqualToZero.and.returnValue(false);
      expressionService.replaceLastCharacter.and.returnValue('20+30-5');
  
      component.expression = '20+30-';
      
      getButtonByTextContent(debugElement, '5')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe('20+30-5');
    });

  });


  describe('Operator Buttons', () => {

    it('should not change the expression if it has the initial value', () => {
      component.expression = '0';
      
      getButtonByTextContent(debugElement, '+')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe('0');
    });

    it('should replace the last character of the expression if it is an operator', () => {
      expressionService.isLastCharacterAnOperator.and.returnValue(true);
      expressionService.replaceLastCharacter.and.returnValue('20+30+');
  
      component.expression = '20+30-';
      
      getButtonByTextContent(debugElement, '+')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe('20+30+');
    });

    it('should append the operator to the expression', () => {
      expressionService.isLastCharacterAnOperator.and.returnValue(false);

      component.expression = '20+30';
      
      getButtonByTextContent(debugElement, '+')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe('20+30+');
    });

  });


  describe('Equals Button', () => {

    it('should not change the expression if its last character is an operator', () => {
      expressionService.isLastCharacterAnOperator.and.returnValue(true);
      
      component.expression = '10+20-40+';
      
      getButtonByTextContent(debugElement, '=')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe('10+20-40+');
    });

    it('should show the result and the expression', () => {
      expressionService.isLastCharacterAnOperator.and.returnValue(false);
      expressionService.evaluate.and.returnValue(BigInt(-50));

      component.expression = '20+30-100';

      getButtonByTextContent(debugElement, '=')?.triggerEventHandler('click', {});
      fixture.detectChanges();

      const resultLine = debugElement.query(By.css(selectors.calcScreenLineResult));
      expect(resultLine.nativeElement.textContent).toBe('20+30-100=-50');

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe(component['INITIAL_EXPRESSION']);
    });

  });


  describe('Delete Button', () => {

    it('should reset the expression to its initial value if its length is 1', () => {
      component.expression = '9';

      getButtonByTextContent(debugElement, '←')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe(component['INITIAL_EXPRESSION']);
    });

    it('should delete the last character of the expression', () => {
      expressionService.replaceLastCharacter.and.returnValue('20+30-10');

      component.expression = '20+30-100';

      getButtonByTextContent(debugElement, '←')?.triggerEventHandler('click', {});      
      fixture.detectChanges();

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe('20+30-10');

      
    });

  });


  describe('Clear Button', () => {

    it('should reset the value of the expression and the result', () => {
      component.result = '10+10+280-100=200';
      component.expression = '20+30-100';

      getButtonByTextContent(debugElement, 'C')?.triggerEventHandler('click', {});
      fixture.detectChanges();

      const resultLine = debugElement.query(By.css(selectors.calcScreenLineResult));
      expect(resultLine.nativeElement.textContent).toBe(component['INITIAL_RESULT']);

      const expressionLine = debugElement.query(By.css(selectors.calcScreenLineExpression));
      expect(expressionLine.nativeElement.textContent).toBe(component['INITIAL_EXPRESSION']);
      
    });
  });
  
});
