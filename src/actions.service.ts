import { Injectable, Type } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

interface H {
  type: string;
}

@Injectable({ providedIn: 'root' })
export class ActionsService {
  constructor(private actionsSubject: ActionsSubject) {}

  dispatch<T extends Action, K extends keyof T>(context: any, action: Type<T>, payload: Exclude<T[K], H> = null) {
    if (environment.production) {
      this.actionsSubject.next(new action(payload));
      return;
    }
    const callingCmp: string = context.__proto__.constructor.name;
    const instance: T = new action(payload);
    instance.type = `[${callingCmp}] ${instance.type}`;
    this.actionsSubject.next(instance);
  }
}

export const debugTypeMap = (effect: string) => (source: Observable<any>): Observable<any> => {
  return source.pipe(
    map(res => {
      if (!res.type || environment.production) {
        return res;
      }
      if (res.type) {
        res.type = `[${effect}] ${res.type}`;
        return res;
      }
      if (res[0].type) {
        res.map(action => (action.type = `[${effect}] ${action.type}`));
        return res;
      }
    })
  );
};
