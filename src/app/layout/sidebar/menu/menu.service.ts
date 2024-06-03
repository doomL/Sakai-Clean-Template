import { Injectable } from '@angular/core';
import { ManuChangeEvent } from '../../api/menuchangeevent'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuSource = new Subject<ManuChangeEvent>();

  menuSource$ = this.menuSource.asObservable();
  constructor() { }

  onMenuStateChange(event: ManuChangeEvent) {
    this.menuSource.next(event);
  }
}
