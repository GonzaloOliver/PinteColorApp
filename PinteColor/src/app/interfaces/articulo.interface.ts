export interface IArticulo {
  id: number;
  code: string;
  codeNumerico?: string;
  codeProveedor: string;
  name: string;
  costPrice: number;
  salePrice: number;
  salePriceWithAliquot: number;
  measure: any;
  description: string;
  aliquot: string;
  minimumStock: number;
  supplier: any;
  brand: any;
  line: any;
  profitMargin: number;

  convertirNumber(): void;
  borrarCampos(): void;
}
