import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[pkmCurrencyInput]',
})
export class CurrencyInputDirective {
  private _prevValue: string = '';

  constructor() {}

  private _twoAfterComas(valueComaSeparated: string[]): boolean {
    return !valueComaSeparated[1] || valueComaSeparated[1].length <= 2;
  }

  private _isValid(event: any): boolean {
    let condition: boolean = !!(parseInt(event.data, 10) || event.data === ',');
    let comaCounter: number = 0;
    const valueArr: string[] = event.target.value.split('');
    const valueArrComas: string[] = event.target.value.split(',');

    valueArr.forEach((item: string) => {
      if (item === ',') comaCounter++;
    });

    return comaCounter <= 1 ? condition && this._twoAfterComas(valueArrComas) : false;
  }

  private _parseString(toParse: string) {
    return toParse
      .split(' ')
      .join('')
      .replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1 ');
  }

  private _addDecimals(value: string) {
    if (!value.includes(',')) {
      return ',00';
    } else {
      switch (value.length - 1 - value.indexOf(',')) {
        case 0:
          return '00';
        case 1:
          return '0';
        default:
          return '';
      }
    }
  }

  @HostListener('input', ['$event'])
  public onInput(event: any): void {
    const cursorPos = event.target.selectionStart;

    if (event.inputType === 'deleteContentBackward') {
      this._prevValue = event.target.value;
      if (event.target.value.split(',')[0] === '') {
        event.target.value = '';
        this._prevValue = event.target.value;
      }
      return;
    }
    if (!this._isValid(event) && event.data !== '0') {
      event.target.value = this._prevValue;
      event.target.setSelectionRange(cursorPos - 1, cursorPos - 1);
      return;
    }

    let value: string = this._parseString(event.target.value);

    const needToShiftCursor: boolean = value.length !== this._prevValue.length + 1;

    value += this._addDecimals(value);

    event.target.value = this._prevValue = value;

    needToShiftCursor
      ? event.target.setSelectionRange(cursorPos + 1, cursorPos + 1)
      : event.target.setSelectionRange(cursorPos, cursorPos);
  }
}
