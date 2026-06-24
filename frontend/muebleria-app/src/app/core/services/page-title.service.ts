import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  private titleSubject = new BehaviorSubject<string>('Panel de Control');
  title$ = this.titleSubject.asObservable();

  setTitle(title: string) {
    this.titleSubject.next(title);
  }
}
