import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  private filterProductIdSource = new Subject<string>();
  private codeScannedSource = new Subject<string>();
  private scannerClosedSource = new Subject<void>();

  filterProductId$ = this.filterProductIdSource.asObservable();
  codeScanned$ = this.codeScannedSource.asObservable();
  scannerClosed$ = this.scannerClosedSource.asObservable();

  emitirFiltroProductId(productId: string) {
    this.filterProductIdSource.next(productId);
  }

  emitCodeScanned(barcode: string) {
    this.codeScannedSource.next(barcode);
  }

  emitScannerClosed() {
    this.scannerClosedSource.next();
  }
}
