import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ExpressionService {
  private readonly numberPattern = /[0-9]+/;
  private readonly operatorPattern = /\+|-/;

  isLastTokenEqualToZero(expression: string): boolean {
    // "20+30" ==> ["20", "30"]
    // "20+30+" ==> ["20", "30", ""]
    const lastNumber = expression.split(this.operatorPattern).pop();
    return lastNumber === '0';
  }

  replaceLastCharacter(expression: string, string: string): string {
    return expression.replace(/.$/, string);
  }

  isLastCharacterAnOperator(expression: string): boolean {
    const lastCharacter = expression.substr(-1);
    return lastCharacter === '+' || lastCharacter === '-'
  }

  evaluate(expression: string): BigInt {
    let numbers: string[] = this.getNumberTokens(expression);
    let operators: string[] = this.getOperatorTokens(expression);
    
    let result = BigInt(numbers[0]);
    for(let i = 0; i < operators.length; i++) {
      if(operators[i] === '+') {
        result += BigInt(numbers[i + 1]);
      } else {
        result -= BigInt(numbers[i + 1]);
      }
    }
    return result;
  }

  private getNumberTokens(expression: string): string[] {
    let numbers = expression.split(this.operatorPattern);
    return numbers;
  }

  private getOperatorTokens(expression: string): string[] {
    // "20+30" ==> ["", "+", ""]
    let operators = expression.split(this.numberPattern);
    operators.shift();
    operators.pop();
    return operators;
  }
  
}
