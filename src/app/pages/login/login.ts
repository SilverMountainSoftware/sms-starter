import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { UserService } from '../../services/user/user.service';
import { UserEventService } from '../../services/user/user-event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private profileService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userEventService: UserEventService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });

  }

  ngOnInit() {}

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();

      const email = loginForm.value.email;
      const password = loginForm.value.password;

      this.authService.loginUser(email, password).then(
        () => {
          this.profileService.setEmail(email);
          this.loading.dismiss().then(() => {
            this.userEventService.publishUserRefresh();
            this.router.navigateByUrl('app/tabs/schedule');
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );
    }
  }
}
