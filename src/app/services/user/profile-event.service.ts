  import { Injectable } from '@angular/core';
  import { Subject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ProfileEventService {
    private profileRefreshAnnouncement = new Subject();
    formRefreshSource$ = this.profileRefreshAnnouncement.asObservable();

    publishRefresh() {
      this.profileRefreshAnnouncement.next();
    }

    constructor() { }
  }
