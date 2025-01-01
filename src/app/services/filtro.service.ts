import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  private filterProductIdSource = new Subject<string>();
  filterProductId$ = this.filterProductIdSource.asObservable();
  constructor() { }

  emitirFiltroProductId(productId: string) {
    this.filterProductIdSource.next(productId);
  }
}
