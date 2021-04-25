import { Component } from '@angular/core';
import { Network } from "@ionic-native/network/ngx";
import { ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import {HomePage} from "../app/home/home.page";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers:[HomePage]
})
export class AppComponent {
  constructor(private network: Network, private toast: ToastController, private storage: Storage,private home:HomePage) { }

  ngOnInit() {
    this.network.onDisconnect().subscribe(() => {
    //  this.showToast("u r offline!");

    });
    this.network.onConnect().subscribe(() => {
    //  this.showToast("u r online!");
      this.home.getData();

    })


  }
  showToast(msg) {
    this.toast.create({
      message: msg,
      duration: 3000
    }).then((ele) => {
      ele.present();
    })
  }
}
