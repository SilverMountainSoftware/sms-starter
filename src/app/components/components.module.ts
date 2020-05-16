import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { CounterInputComponent } from './counter-input/counter-input.component';
import { RatingInputComponent } from './rating-input/rating-input.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule.forRoot()
  ],
  declarations: [
    CountdownTimerComponent,
    ListUsersComponent,
    CounterInputComponent,
    RatingInputComponent
  ],
  exports: [
    CountdownTimerComponent,
    ListUsersComponent,
    CounterInputComponent,
    RatingInputComponent,
    RouterModule,
  ]
})
export class ComponentsModule {}
