import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {Network} from "@ionic-native/network/ngx";
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import {HTTP} from "@ionic-native/http/ngx";
import {Camera} from "@ionic-native/camera/ngx";
import {PopupPageModule} from "../app/popup/popup.module";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,IonicStorageModule.forRoot(),HttpClientModule,PopupPageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Network,HTTP,Camera],
  bootstrap: [AppComponent],
})
export class AppModule {}
