import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


export const selectors = { 
    calcScreenLineResult: '.calc .calc__screen-line--result',
    calcScreenLineExpression: '.calc .calc__screen-line--expression',
}

export const getButtonByTextContent = (debugElement: DebugElement, 
    textContent: string): DebugElement | undefined => {

        const buttonDebugElement = [ ...debugElement.queryAll(By.css('button'))].find(
            buttonDebugEl => buttonDebugEl.nativeElement.textContent === textContent
        );
        return buttonDebugElement;
}


