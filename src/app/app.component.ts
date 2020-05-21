import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { environment } from '../../src/environments/environment';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/user/auth.service';
import { UserService } from './services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

import { Storage } from '@ionic/storage';
import { UserType } from './enums/user-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'people'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];
  loggedIn = false;
  admin = false;
  public userId: any;
  dark = false;
  userSubscription: any;
  public userProfile: any = {};
  public userType: UserType = UserType.Unapproved;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private profileService: UserService,
  ) {
    this.initializeApp();
  }


  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    firebase.initializeApp(environment.firebase);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async getProfile() {
    this.profileService.getUserProfile().then(userProfileSnapshot => {
      if (userProfileSnapshot.data()) {
        this.userProfile = userProfileSnapshot.data();
        this.admin = this.userProfile.admin;
        this.userType = this.userProfile.userType;
      }
    });
  }

  async checkProfile() {
    if (this.userId) {
      this.getProfile();
    }
  }

  async checkLoginStatus() {
    const user: firebase.User = await this.authService.getUser();
    if (user) {
      this.loggedIn = true;
      this.userId = user.uid;
      this.getProfile();
    } else {
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }

      this.loggedIn = false;
      this.userId = null;
      this.userProfile = null;
    }

    return this.updateLoggedInStatus(this.loggedIn);
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.authService.logoutUser().then(() => {
      this.loggedIn = false;
      this.admin = false;
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
