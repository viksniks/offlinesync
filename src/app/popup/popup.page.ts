import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Storage } from "@ionic/storage";
import { LoadingController, ToastController, Platform, ModalController } from "@ionic/angular";
import { Network } from "@ionic-native/network/ngx";
import { HTTP } from "@ionic-native/http/ngx";
import firebase from 'firebase';
import { environment } from "../../environments/environment";
@Component({
  selector: 'app-popup',
  templateUrl: './popup.page.html',
  styleUrls: ['./popup.page.scss'],
})
export class PopupPage implements OnInit {
  id: string = "";
  attachments: any[] = [];
  config: any = environment.firebaseConfig;
  loaderRef: any;
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

  constructor(private modalCtrl: ModalController, private camera: Camera, private http1: HTTP, private loader: LoadingController, private toast: ToastController, private network: Network, private storage: Storage, private platform: Platform) { }
  close() {
    this.modalCtrl.dismiss();

  }
  ngOnInit() {
    if (firebase.apps.length == 0) {
      firebase.initializeApp(this.config);

    }
  }

  pushDataTemp() {
    var ref = this;
    this.showLoader("posting data");
    this.objtemp.FECHA_INGRESO = new Date();
    this.objtemp.F_INGRESO = new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split("GMT")[0].trim();
    this.objtemp.FECHA_SALIDA = new Date();
    this.objtemp.F_SALIDA = new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split("GMT")[0].trim();



    this.pushData(this.objtemp, function () {
      ref.hideLoader();

    });


  }
  pushData(requestData, fn) {

    var ref = this;

    var url = "http://apihawksdemo.services-hawks.com/api/CreateBitacora";


    ref.http1.setDataSerializer("json");
    var key = new Date().toISOString().split("T")[0];
    ref.http1.post(url, requestData, { "Content-Type": "application/json" }).then((res) => {


      var val = JSON.parse(JSON.parse(res.data));
      this.id = val.title;
      fn();



      ref.showToast(val.message);




    }, (err) => {
      fn();




    })
    // })

  }
  pushData1Temp() {
    var ref = this;
    var i = 0;
    this.showLoader("uploading attachments...");
    inner();
    function inner() {
      ref.pushData1(ref.attachments[i], function () {
        i++;
        if (i < ref.attachments.length) {
          inner();
        }
        else {
          ref.hideLoader();
          ref.attachments = [];

        }

      })

    }
  }
  pushData1(obj, fn) {
    if (navigator.onLine) {
      var ref = this;
      this.upload(obj.FOTO, Date.now().toString(), function (downloadurl) {


        var url = "http://apihawksdemo.services-hawks.com/api/CreateAttachBitacora";


        ref.http1.setDataSerializer("json");
        obj.FOTO = downloadurl;
        ref.http1.post(url, obj, { "Content-Type": "application/json" }).then((res) => {


          fn();



        })
      })
    }
    else {
      fn();
    }





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
      var obj = {
        CODIGO: null,
        CODIGO_BITACORA: ref.id,
        TIPO: 1,
        OBSERVACION: "SN",
        FOTO: base64Image


      }
      ref.attachments.push(obj);



    }, (err) => {
      // Handle error
    });

  }
  removeAllImages() {
    this.attachments = [];
  }
  removeAttachments(i) {
    this.attachments.slice(i, 1);
  }

  upload(base64, fileName, fn) {

    let ref = this;

    if (navigator.onLine) {


      var storageref = firebase.storage().ref();

      var childRef = storageref.child(fileName);
      childRef.putString(base64, "data_url").then((snapshot) => {
        // ele.dismiss();
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL);
          ref.showToast("downloadurl = " + downloadURL);
          fn(downloadURL)
        }, (err) => {
          // ele.dismiss();
          if (navigator.onLine == false) {
            fn(base64);
          }
          console.log(err);
        });
      }, (err) => {
        //  ele.dismiss();
        console.log(err);
      })
    }
    else {
      // ele.dismiss();
      fn(base64);
    }


    // })

  }


  showToast(msg) {
    this.toast.create({
      message: msg,
      duration: 3000
    }).then((ele) => {
      ele.present();
    })
  }

  showLoader(msg) {
    this.loader.create({
      message: msg
    }).then((ele) => {
      this.loaderRef = ele;
      this.loaderRef.present();
    })

  }

  hideLoader() {
    if (this.loaderRef) {
      this.loaderRef.dismiss();
      this.loaderRef = undefined;
    }
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