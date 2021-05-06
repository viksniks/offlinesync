import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PopupPage } from "../popup/popup.page";
import { ModalController } from "@ionic/angular";
import { Network } from "@ionic-native/network/ngx";
import firebase from 'firebase';
import { environment } from "../../environments/environment";
import { HTTP } from "@ionic-native/http/ngx";
import { Storage } from "@ionic/storage";


declare var window;
@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
  providers: [PopupPage]
})
export class OfflinePage implements OnInit {

  config: any = environment.firebaseConfig;
  calling: boolean = true;
  existingData: any[] = [];
  constructor(private storage: Storage, private changeRef: ChangeDetectorRef, private http1: HTTP, private modalCtrl: ModalController, private pop: PopupPage, private network: Network) {
    window.offline = this;
  }
  ngOnInit() {
    if (firebase.apps.length == 0) {
      firebase.initializeApp(this.config);

      this.subscribeNetworkDetection();

    }
    var ref = this;
    this.pop.sync(function () {
      ref.calling = false;
      ref.getData();
      ref.deleteAllOfflinePosts();
    });


  }
  ionViewWillEnter() {
    //this.getData();
  }

  subscribeNetworkDetection() {
    this.network.onDisconnect().subscribe(() => {

      console.log("disconnect");

    });
    var init = false;
    this.network.onConnect().subscribe(() => {

      console.log("connect");

      var ref = this;
      if (this.calling == false) {
        if (init == false) {
          init = true;
          this.pop.sync(function () {

            ref.getData();

          })
        }
      }



    })
  }

  getData() {
    var key = new Date().toISOString().split("T")[0];
    this.pop.showLoader("loading data...");
    if (navigator.onLine) {





      var url = "http://apihawksdemo.services-hawks.com/api/GetListBitacoraTurn?codUser=18";

      this.http1.sendRequest(url, { method: "get" }).then((data: any) => {


        this.existingData = JSON.parse(JSON.parse(data.data));
        console.log(this.existingData);
        this.storage.set(key, this.existingData);
        this.getOfflineData();

        this.changeRef.detectChanges();
        setTimeout(() => {
          this.pop.hideLoader();
        }, 2000)
      }, (err) => {

        setTimeout(() => {
          this.pop.hideLoader();
        }, 2000)
        if (navigator.onLine == false) {
          this.storage.get(key).then((arr) => {
            if (arr) {
              this.existingData = arr;
              this.getOfflineData();
              this.changeRef.detectChanges();
            }
          })

        }



      })
    }
    else {
      setTimeout(() => {
        this.pop.hideLoader();
      }, 2000)
      this.storage.get(key).then((arr) => {
        if (arr) {
          this.existingData = arr;
          this.getOfflineData();
          this.changeRef.detectChanges();
        }
      })

    }
  }

  openPopUp() {
    this.modalCtrl.create({
      component: PopupPage,
      backdropDismiss: false,
      showBackdrop: true

    }).then((ele) => {
      ele.present();
    })
  }
  getOfflineData() {
    this.storage.get("posts").then((arr) => {


      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].status == "0") {
            var obj = arr[i].data;

            this.storage.get(obj.CODIGO).then((arr1) => {
              console.log(arr1);
              if (arr1) {
                obj.LISTA_ADJUNTOS = arr1;
              }
              this.existingData.unshift(obj);
            })


          }

        }

        this.changeRef.detectChanges();

      }




    })

  }

  deleteAllOfflinePosts() {

    this.storage.get("posts").then((arr) => {

      if (arr) {
        var arrtemp = arr;

        for (var i = 0; i < arr.length; i++) {
          if(arr[i].status == "1")
          {
            arrtemp.splice(i,1);
            this.storage.get(arr[i].data.CODIGO).then((val)=>{
              if(val)
              {
                this.storage.remove(arr[i].data.CODIGO);
              }
            })
          }

        }
        this.storage.set("posts",arrtemp);



      }



    })


  }

}
