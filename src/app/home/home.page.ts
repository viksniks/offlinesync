import { Component } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HTTP } from "@ionic-native/http/ngx";
import { LoadingController, ToastController, Platform } from "@ionic/angular";
import { Network } from "@ionic-native/network/ngx";
import { Storage } from "@ionic/storage";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import firebase from 'firebase';
import { environment } from "../../environments/environment";



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  offline: boolean = false;
  segment: string = "new";
  init: boolean = true;
  attachments: any[] = [];
  config: any = environment.firebaseConfig;
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
  constructor(private camera: Camera, private http: HttpClient, private http1: HTTP, private loader: LoadingController, private toast: ToastController, private network: Network, private storage: Storage, private platform: Platform) { }

  openImage(url) {
    window.open(url);
  }
  captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      let base64Image = 'data:image/png;base64,' + imageData;

      var ref = this;
      this.upload(base64Image, Date.now() + ".png", function (url) {

        var obj = {
          CODIGO: null,
          CODIGO_BITACORA: null,
          TIPO: 1,
          OBSERVACION: "SN",
          FOTO: url


        }
        // alert(base64Image == url);
        if (base64Image == url) {
          obj["base64"] = true;
        }
        ref.attachments.push(obj);

      });

    }, (err) => {
      // Handle error
    });

  }
  ngOnInit() {
    this.platform.ready().then(() => {

      if (firebase.apps.length == 0) {
        firebase.initializeApp(this.config);

      }

      this.init = true;
      if (navigator.onLine) {
        this.offline = false;
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
    if (index == -1) {
      requestData.LISTA_ADJUNTOS = this.attachments;

      this.attachments = [];

    }
    var ref = this;
    //  alert(JSON.stringify(requestData.LISTA_ADJUNTOS));
    this.uploadOfflineImages(requestData.LISTA_ADJUNTOS, function (arr) {
      //  alert(JSON.stringify(arr));
      requestData.LISTA_ADJUNTOS = arr;
      var url = "http://apihawksdemo.services-hawks.com/api/CreateBitacora";


      ref.http1.setDataSerializer("json");
      var key = new Date().toISOString().split("T")[0];
      ref.http1.post(url, requestData, { "Content-Type": "application/json" }).then((res) => {


        var val = JSON.parse(JSON.parse(res.data));

        ref.pushData1(requestData.LISTA_ADJUNTOS, val.title, function () {
          if (index != -1) {
            ref.removeOfflineRequest(index, function () {
              fn();
            })
          }
          else {
            ref.getData();
            fn();
          }

          ref.showToast(val.message);

        })


      }, (err) => {
        console.log(fn);


        if (navigator.onLine == false) {
          ref.showToast("Registro de bitacora correcto:");

          if (offlinePost == false) {
            ref.storage.get(key).then((offlinedata) => {

              if (offlinedata) {
                offlinedata.unshift(requestData);
                ref.storage.set(key, offlinedata);
                ref.dataFromApi.unshift(requestData);
                ref.addOfflineRequest(requestData);
                fn();


              }
              else {
                var arr = [];
                arr.push(requestData);
                ref.storage.set(key, arr);
                ref.dataFromApi.unshift(requestData);
                ref.addOfflineRequest(requestData);
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
          ref.showToast(JSON.stringify(err));

        }

      })
    })

  }
  pushData1(arr, title, fn) {
    if (arr.length > 0) {
      var i = 0;
      var ref = this;
      inner();

      function inner() {
        var url = "http://apihawksdemo.services-hawks.com/api/CreateAttachBitacora";


        ref.http1.setDataSerializer("json");
        arr[i].CODIGO_BITACORA = title;
        ref.http1.post(url, arr[i], { "Content-Type": "application/json" }).then((res) => {
          console.log(res);
          i++;
          if (i < arr.length) {
            inner();
          }
          else {
            fn();
          }



        })

      }
    }
    else {
      fn();
    }

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
  uploadOfflineImages(arr, fn) {
    if (arr.length > 0) {
      let i = 0;
      var ref = this;
      inner();

      function inner() {
        // alert(arr[i].base64);
        // alert(arr.length);
        if (arr[i].base64) {
          ref.upload(arr[i].FOTO, Date.now().toString() + ".png", function (url) {
            arr[i].FOTO = url;
            if (url != arr[i].FOTO) {
              delete arr[i].base64;
            }
            i++
            if (i < arr.length) {
              inner();
            }
            else {
              fn(arr);

            }


          })

        }
        else {
          i++;
          if (i < arr.length) {
            inner();
          }
          else {
            fn(arr);

          }
        }
      }
    }
    else {
      fn(arr);
    }
  }

  upload(base64, fileName, fn) {

    let ref = this;
    this.loader.create({
      message: "uploading file..."
    }).then((ele) => {

      ele.present();
      if (navigator.onLine) {

        // window.app.firebasetemp.database().ref(window.app.appName+"/images/"+id+"/").set(obj, function (err) {

        //   ele.dismiss();
        // })
        var storageref = firebase.storage().ref();

        var childRef = storageref.child(fileName);
        childRef.putString(base64, "data_url").then((snapshot) => {
          ele.dismiss();
          snapshot.ref.getDownloadURL().then((downloadURL) => {
           ref.showToast("downloadurl = "+downloadURL);
            fn(downloadURL)
          }, (err) => {
            ele.dismiss();
            if (navigator.onLine == false) {
              fn(base64);
            }
            console.log(err);
          });
        }, (err) => {
          ele.dismiss();
          console.log(err);
        })
      }
      else {
        ele.dismiss();
        fn(base64);
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
  LISTA_ADJUNTOS: any[]
}

