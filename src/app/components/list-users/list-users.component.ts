import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/user/user-profile.service';
import { UserProfileId } from '../../interfaces/user-profile';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  public users: UserProfileId[];
  public title = 'admin';
  public admin = 'Admin';
  public teacher = 'Therapist';
  public student = 'Patient';
  public unapproved = 'Unapproved';
  constructor(
    private router: Router,
    public translate: TranslateService,
    public userProfileService: UserProfileService,
  ) { }

  ngOnInit() {
    this.getAdmins();
    this.getTranslations();
  }

  getTranslations() {
    this.translate.get('ROLES.ADMIN').subscribe((res: string) => {
      this.admin = res;
      this.title = res;
    });
    this.translate.get('ROLES.TEACHER').subscribe((res: string) => {
      this.teacher = res;
    });
    this.translate.get('ROLES.STUDENT').subscribe((res: string) => {
      this.student = res;
    });
    this.translate.get('ROLES.UNAPPROVED').subscribe((res: string) => {
      this.unapproved = res;
    });
  }

  getStudent() {
    this.userProfileService.getRegularUsers().subscribe(users => {
      this.users = users;
    });
  }

  getAdmins() {
    this.userProfileService.getAdmins().subscribe(users => {
      this.users = users;
    });
  }

  getTeacher() {
    this.userProfileService.getSuperUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUnapproved() {
    this.userProfileService.getUnapproved().subscribe(users => {
      this.users = users;
    });
  }

  getAll() {
    this.userProfileService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  editProfile(id: string) {
    this.router.navigate(['/profile', id]);
  }

  editCalendar(id: string) {
    this.router.navigate(['/profile-calendar', id]);
  }

  selectionChanged(event) {
    this.title = event.detail.value;
    switch (this.title) {
      case 'all': {
        this.getAll();
        break;
      }
      case 'admin': {
        this.getAdmins();
        break;
      }
      case 'teacher': {
        this.getTeacher();
        break;
      }
      case 'student': {
        this.getStudent();
        break;
      }
      case 'unapproved': {
        this.getUnapproved();
        break;
      }
    }

    this.translate.get('ROLES.' + event.detail.value.toUpperCase()).subscribe((res: string) => {
      this.title = res;
    });
  }
}

