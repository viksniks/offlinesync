import { Component, TRANSLATIONS } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HTTP } from "@ionic-native/http/ngx";
import { LoadingController, ToastController, Platform } from "@ionic/angular";
import { Network } from "@ionic-native/network/ngx";
import { Storage } from "@ionic/storage";
import { ThrowStmt } from '@angular/compiler';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  offline: boolean = false;
  segment: string = "new";
  init: boolean = true;
  objtemp: obj = {
    CODIGO: null,

    FECHA_INGRESO: new Date(),
    F_INGRESO: new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split("GMT")[0].trim(),
    FECHA_SALIDA: new Date(),
    F_SALIDA: new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split("GMT")[0].trim(),
    CODIGO_VISITANTE: 175, //number
    NOMBRE_VISITANTE: null,
    CEDULA_VISITANTE: null,
    EMPRESA_VISITANTE: null,
    FOTO_VISITANTE: null,
    TIPO: null, //number
    AREA_VISITA: null,
    RESPONSABLE: null,
    OBSERVACION: null,
    CODIGO_TURNO: 400, //number
    CODIGO_PUNTO_CONTROL: 3, //number
    NOMBRE_PUNTO_CONTROL: null,
    CODIGO_SUCURSAL_CLIENTE: null,
    NOMBRE_SUCURSAL_CLIENTE: null,
    DIRECCION_SUCURSAL_CLIENTE: null,
    TELEFONO_SUCURSAL_CLIENTE: null,
    CODIGO_USUARIO: 18,
    NOMBRE_USUARIO: null,
    TELEFONO_USUARIO: null,
    CANTIDAD_ADJUNTOS: null,
    LISTA_ADJUNTOS: null

  }
  dataFromApi: obj[] = [];
  constructor(private http: HttpClient, private http1: HTTP, private loader: LoadingController, private toast: ToastController, private network: Network, private storage: Storage, private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {

      this.init = true;
      if (navigator.onLine) {
        this.pushOfflinePosts();
      }
      else {
        this.offline = true;
        this.getData();
      }
      this.subscribeNetworkDetection();
      this.deletePreviousDateDatas();
      // this.getData();
    });










  }
  subscribeNetworkDetection() {
    this.network.onDisconnect().subscribe(() => {
      if (this.offline == false) {
        this.offline = true;
        //this.showToast("you are offline!");
        if (this.init == false) {
          this.getData();
        }
      }


    });
    this.network.onConnect().subscribe(() => {
      if (this.offline) {
        this.offline = false;
        if (this.init == false) {
          
          this.pushOfflinePosts();
        }
      }
      // this.showToast("you are online!");
      // this.getData();


    })
  }

  deletePreviousDateDatas() {
    this.storage.keys().then((keys) => {
      if (keys) {
        var key = new Date().toISOString().split("T")[0];
        for (var i = 0; i < keys.length; i++) {

          if (key != keys[i]) {
            if (keys[i] != "posts") {
              this.storage.remove(keys[i]);
            }
          }




        }
      }
    })
  }

  pushOfflinePosts() {

    if (this.offline == false) {
      this.storage.get("posts").then((posts) => {

        if (posts) {


          var i = 0;
          var ref = this;
          this.loader.create({
            message: "syncing data"
          }).then((ele) => {
            ele.present();
            inner();
            function inner() {

              if (posts[i]["inserted"] == "0") {
                ref.pushData(posts[i], i, function () {

                  i++;
                  if (i < posts.length) {
                    inner();
                  }
                  else {
                    ele.dismiss();
                    ref.getData();
                    ref.init = false;



                  }

                })
              }
              else {
                i++;
                if (i < posts.length) {
                  inner();
                }
                else {
                  ele.dismiss();
                  ref.getData();
                  ref.init = false;



                }

              }

            }
          })
        }
        else {
          this.getData();
        }
      })
    }
  }
  segmentChanged(event) {

    this.segment = event.target.value;

  }
  getData() {
    var key = new Date().toISOString().split("T")[0];
    this.loader.create({
      message: "loading data..."
    }).then((ele) => {

      ele.present();
      var url = "http://apihawksdemo.services-hawks.com/api/GetListBitacoraTurn?codUser=18";

      this.http1.sendRequest(url, { method: "get" }).then((data: any) => {
        this.init = false;
        ele.dismiss();
        this.dataFromApi = JSON.parse(JSON.parse(data.data));
        console.log(this.dataFromApi);
        this.storage.set(key, this.dataFromApi);
      }, (err) => {
        this.init = false;
        ele.dismiss();
        if (this.offline) {

          this.storage.get(key).then((offlinedata) => {
            if (offlinedata) {
              this.dataFromApi = offlinedata;
            }

          })
        }
        else {
          //this.showToast(JSON.stringify(err));
        }
      })
    })
  }
  pushDataTemp() {
    var ref = this;
    this.loader.create({
      message: "posting data"
    }).then((ele) => {

      ele.present();
      this.objtemp.FECHA_INGRESO = new Date();
      this.objtemp.F_INGRESO = new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split("GMT")[0].trim();
      this.objtemp.FECHA_SALIDA = new Date();
      this.objtemp.F_SALIDA = new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split("GMT")[0].trim();
      var obj = this.objtemp;
      if (obj["inserted"]) {
        delete obj["inserted"];

      }

      this.pushData(this.objtemp, -1, function () {
        ele.dismiss();

      });
    })

  }
  pushData(requestData, index, fn) {

    var offlinePost = false;
    if (requestData.inserted) {
      delete requestData.inserted;
      offlinePost = true;
    }
    var url = "http://apihawksdemo.services-hawks.com/api/CreateBitacora";


    this.http1.setDataSerializer("json");
    var key = new Date().toISOString().split("T")[0];
    this.http1.post(url, requestData, { "Content-Type": "application/json" }).then((res) => {


      var val = JSON.parse(JSON.parse(res.data));


      if (index != -1) {
        this.removeOfflineRequest(index, function () {
          fn();
        })
      }
      else {
        this.getData();
        fn();
      }

      this.showToast(val.message);

    }, (err) => {
      console.log(fn);


      if (this.offline) {
        this.showToast("Registro de bitacora correcto:");

        if (offlinePost == false) {
          this.storage.get(key).then((offlinedata) => {

            if (offlinedata) {
              offlinedata.unshift(requestData);
              this.storage.set(key, offlinedata);
              this.dataFromApi.unshift(requestData);
              this.addOfflineRequest(requestData);
              fn();


            }
            else {
              var arr = [];
              arr.push(requestData);
              this.storage.set(key, arr);
              this.dataFromApi.unshift(requestData);
              this.addOfflineRequest(requestData);
              fn()


            }

          })
        }
        else {

          fn();
        }





      }
      else {
        fn();
        this.showToast(JSON.stringify(err));

      }

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

  addOfflineRequest(obj) {
    obj["inserted"] = "0";
    this.storage.get("posts").then((posts) => {
      if (posts) {

        posts.unshift(obj);
        this.storage.set("posts", posts);


      }
      else {
        var arr = [];
        arr.push(obj);
        this.storage.set("posts", arr);




      }

    })

  }

  removeOfflineRequest(index, fn) {

    this.storage.get("posts").then((posts) => {
      if (posts) {
        console.log(posts.length);
        posts[index]["inserted"] = "1";
        console.log(index);
        console.log(posts.length);
        this.storage.set("posts", posts).then(() => {
          fn();
        })


      }
    })

  }


}
interface obj {
  CODIGO: number,
  FECHA_INGRESO: Date,
  F_INGRESO: string,
  FECHA_SALIDA: Date,
  F_SALIDA: string,
  CODIGO_VISITANTE: number, //number
  NOMBRE_VISITANTE: string,
  CEDULA_VISITANTE: string,
  EMPRESA_VISITANTE: string,
  FOTO_VISITANTE: string,
  TIPO: number
  AREA_VISITA: string,
  RESPONSABLE: string,
  OBSERVACION: string,
  CODIGO_TURNO: number
  CODIGO_PUNTO_CONTROL: number
  NOMBRE_PUNTO_CONTROL: string,
  CODIGO_SUCURSAL_CLIENTE: string,
  NOMBRE_SUCURSAL_CLIENTE: string,
  DIRECCION_SUCURSAL_CLIENTE: string,
  TELEFONO_SUCURSAL_CLIENTE: string,
  CODIGO_USUARIO: number,
  NOMBRE_USUARIO: string,
  TELEFONO_USUARIO: string,
  CANTIDAD_ADJUNTOS: string,
  LISTA_ADJUNTOS: string
}
