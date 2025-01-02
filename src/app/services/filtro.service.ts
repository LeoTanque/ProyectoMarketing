import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  private filterProductIdSource = new Subject<string>();
  filterProductId$ = this.filterProductIdSource.asObservable();
  private codeScannedSource = new Subject<string>();
  codeScanned$ = this.codeScannedSource.asObservable();
  constructor() { }

  emitirFiltroProductId(productId: string) {
    this.filterProductIdSource.next(productId);
  }

  emitCodeScanned(barcode: string) {
    this.codeScannedSource.next(barcode);
  }
}
