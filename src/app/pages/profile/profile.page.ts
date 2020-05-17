import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserType } from '../../enums/user-type';
import { UserProfileId } from '../../interfaces/user-profile';

import { AuthService } from '../../services/user/auth.service';
import { UserService } from '../../services/user/user.service';
import { UserProfileService } from '../../services/user/user-profile.service';
@Component({

  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  public errorMessage = '';
  form: FormGroup;
  userTypes: UserType[] = [];
  public userProfile: UserProfileId;
  public currentUser: any = {};
  public isSuperUser = false;
  public uid = '';
  public submitAttempt = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder
  ) {
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('id');
      console.log('profile uid', this.uid);
      this.userProfileService.getUser(this.uid).subscribe(res => {
        this.userProfile = res;
        this.form.patchValue(this.userProfile);
        this.isSuperUser = this.userProfile.userType === UserType.SuperUser;
      });
    });
  }

  ionViewDidEnter() {
    this.userService.getUserProfile().then(currentUser => {
      if (currentUser.data()) {
        this.currentUser = currentUser.data();
      }
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      email:  [''],
      firstName:  [''],
      lastName:  [''],
      birthDate:  [''],
      admin:  [false],
      approved:  [false],
      userType:  [''],
      teachingLocations: [''],
      location: [''],
      times: this.fb.array([])
    });

    const times = this.form.controls.times as FormArray;
    times.push(this.fb.group({
      //// am: [9, AmValidator.isValid],
      am: 9,
      pm: 2,
      evening: 7,
    }));
  }

  publishChange(): void {
    //// this.profileEventService.publishRefresh();
  }

  logOut(): void {
    this.authService.logoutUser().then(() => {
      this.router.navigateByUrl('login');
    });
  }

onFormSubmit() {
  this.submitAttempt = true;

  this.errorMessage = '';
  if (!this.form.valid) {
    this.errorMessage = 'Please select a value for each item below';
    return false;
  }

  this.userProfileService.updateUser(this.form.value).then(res => {
    this.form.reset();
    this.publishChange();
    this.router.navigate(['/home']);
  })
    .catch(error => console.log(error));

  this.router.navigate(['/home']);
}

}
