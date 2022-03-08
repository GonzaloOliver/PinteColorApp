import { ISaldoCliente } from './../interfaces/saldocliente.interface';

export class SaldoCliente implements ISaldoCliente {
  customerId: number;
  totalDebt: number;
  debt: number;
  debtX: number;

  constructor(result?: any) {
    if (result) {
      this.customerId = result.customerId;
      this.totalDebt = result.totalDebt;
      this.debt = result.debt;
      this.debtX = result.debtX;
    } else {
      this.customerId = 0;
      this.totalDebt = 0;
      this.debt = 0;
      this.debtX = 0;
    }
  }
}
