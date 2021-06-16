import { Component } from '@angular/core';

import { ExpressionService } from './services/expression.service';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  private readonly INITIAL_RESULT = '';
  private readonly INITIAL_EXPRESSION = '0';
  result: string;
  expression: string;
  
  
  constructor(private exprService: ExpressionService) { 
    this.result = this.INITIAL_RESULT;
    this.expression = this.INITIAL_EXPRESSION;
  }

  onPressNumber(number: string): void {
    if(this.exprService.isLastTokenEqualToZero(this.expression)){
      this.expression = this.exprService.replaceLastCharacter(this.expression, number);
    } else {
      this.expression += number;
    }
  }

  onPressOperator(operator: string): void {
    // equality check to the "initial value", because initial value happen to be also 0
    if(this.expression === '0') {
      return;
    } else if(this.exprService.isLastCharacterAnOperator(this.expression)) {
      this.expression = this.exprService.replaceLastCharacter(this.expression, operator);
    } else {
      this.expression += operator;
    }
  }

  onPressEquals(): void {
    if(this.exprService.isLastCharacterAnOperator(this.expression)) {
      return;
    }
    // NOT USE THEM WITH BIG NUMBERS ==> Precision error
    // + convert from scientific notation
    // const evaluationResult = eval(this.expression);
    // const evaluationResult = new Function(`return ${this.expression}`)();
    
    const evaluationResult = this.exprService.evaluate(this.expression);
    this.result = `${this.expression}=${evaluationResult}`;
    this.expression = this.INITIAL_EXPRESSION;
  }

  onPressDelete(): void { 
    if(this.expression.length === 1) {
      this.expression = this.INITIAL_EXPRESSION;
    } else {
      this.expression = this.exprService.replaceLastCharacter(this.expression, '');
    }
  }

  onPressClear(): void {
    this.result = this.INITIAL_RESULT;
    this.expression = this.INITIAL_EXPRESSION;
  }

}
