import { IArticulo } from '../interfaces/articulo.interface';
import { Linea } from './linea.model';
import { Marca } from './marca.model';
import { Proveedor } from './proveedor.model';

export class Articulo implements IArticulo {
  id: number;
  code: string;
  codeNumerico?: string;
  codeProveedor: string;
  name: string;
  measure: string;
  description: string;
  aliquot: string;
  minimumStock: number;
  supplier: any;
  brand: any;
  line: any;
  profitMargin: number;
  costPrice: number;
  salePrice: number;
  salePriceWithAliquot: number;

  constructor(result?: any) {
    if (result) {
      (this.id = result.id),
        (this.name = result.name),
        (this.costPrice = result.costPrice),
        (this.code = result.code),
        (this.codeNumerico = result.code.substring(
          4,
          String(result.code).length
        )),
        (this.codeProveedor = result.code.substring(0, 3)),
        (this.salePrice = result.salePrice);
      this.salePriceWithAliquot = result.salePriceWithAliquot;
      this.measure = result.measure;
      this.description = result.description;
      this.aliquot = result.aliquot;
      this.minimumStock = result.minimumStock;
      this.supplier = new Proveedor(result.supplier);
      this.brand = new Marca(result.brand);
      this.line = new Linea(result.line);
      this.profitMargin = result.profitMargin;
    } else {
      (this.id = 0),
        (this.code = ''),
        (this.codeNumerico = ''),
        (this.codeProveedor = ''),
        (this.name = ''),
        (this.costPrice = 0),
        (this.salePrice = 0),
        (this.salePriceWithAliquot = 0),
        (this.measure = ''),
        (this.description = ''),
        (this.aliquot = ''),
        (this.minimumStock = 0),
        (this.supplier = new Proveedor()),
        (this.brand = new Marca()),
        (this.line = new Linea());
      this.profitMargin = 0;
    }
  }

  convertirNumber(): void {
    this.costPrice = Number(this.costPrice);
    this.salePrice = Number(this.salePrice);
    this.salePriceWithAliquot = Number(this.salePriceWithAliquot);
    this.profitMargin = Number(this.profitMargin);
    this.minimumStock = Number(this.minimumStock);
    this.line.id = Number(this.line.id);
    this.brand.id = Number(this.brand.id);
    this.supplier.id = Number(this.supplier.id);
  }

  borrarCampos(): void {
    (this.id = 0),
      (this.code = ''),
      (this.codeNumerico = ''),
      (this.codeProveedor = ''),
      (this.name = ''),
      (this.costPrice = 0),
      (this.salePrice = 0),
      (this.salePriceWithAliquot = 0),
      (this.measure = ''),
      (this.description = ''),
      (this.aliquot = ''),
      (this.minimumStock = 0),
      (this.supplier = new Proveedor()),
      (this.brand = new Marca()),
      (this.line = new Linea()),
      (this.profitMargin = 0);
  }
}
