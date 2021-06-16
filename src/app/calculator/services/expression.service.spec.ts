import { TestBed } from '@angular/core/testing';

import { ExpressionService } from './expression.service';


describe('ExpressionService', () => {
  let service: ExpressionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpressionService);
  });

  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should be true if the last token of the expression is "0"', () => {
    const result = service.isLastTokenEqualToZero('0');
    expect(result).toBeTrue();
  });


  it('should replace the last character of the expression if any', () => {
    const result = service.replaceLastCharacter('20+30-50+', '-');
    expect(result).toBe('20+30-50-');

    const result2 = service.replaceLastCharacter('', '-');
    expect(result2).toBe('');
  });


  it('should be true if the last character of the expression is an operator', () => {
    const result = service.isLastCharacterAnOperator('20+');
    expect(result).toBeTruthy();

    const result2 = service.isLastCharacterAnOperator('1-');
    expect(result2).toBeTrue();
  });


  it('should get the number tokens from the expression', () => {
    // because private method
    const result = service['getNumberTokens']('20+30-50');
    expect(result).toEqual(['20', '30', '50']);
    
    const result2 = service['getNumberTokens']('20+30-50+');
    expect(result2).toEqual(['20', '30', '50', '']);
  });


  it('should get the operator tokens from the expression', () => {
    // because private method
    const result = service['getOperatorTokens']('20+30-50');
    expect(result).toEqual(['+', '-']);

    const result2 = service['getOperatorTokens']('20+30-');
    expect(result2).not.toEqual(['+', '-']);
  });


  it('should evaluate the expression', () => {
    const result = service.evaluate('20+30-50+10');
    expect(result).toEqual(BigInt(10));
  });
  
});
