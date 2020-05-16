import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserEventService {
  private userRefreshAnnouncement = new Subject();
  formRefreshSource$ = this.userRefreshAnnouncement.asObservable();

  publishUserRefresh() {
    this.userRefreshAnnouncement.next();
  }
  constructor() { }
}

