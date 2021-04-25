import { Component } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HTTP } from "@ionic-native/http/ngx";



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  objtemp:obj={
    CODIGO: null,
    // FECHA_INGRESO: new Date().toISOString(),
    // F_INGRESO: new Date().toISOString().split("T")[0]+ " "+new Date().toTimeString().split("GMT")[0].trim(),
    // FECHA_SALIDA: new Date().toISOString(),
    // F_SALIDA: new Date().toISOString().split("T")[0]+ " "+new Date().toTimeString().split("GMT")[0].trim(),
    FECHA_INGRESO: new Date(),
    F_INGRESO: "13:41 24-04-2021",
    FECHA_SALIDA: new Date(),
    F_SALIDA: "14:41 24-04-2021",
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
  data:obj[] = [];
  constructor(private http: HttpClient, private http1: HTTP) { }

  ngOnInit() {

  }

  getData() {

    // var url = "http://apihawksdemo.services-hawks.com/api/GetListBitacoraTurn?codUser=18";

    // this.http1.sendRequest(url, { method: "get" }).then((data) => {
    //   this.data = JSON.parse(data.data);
    // }, (err) => {
    //   alert(JSON.stringify(err));
    // })
  }

  pushData()
  {
    var url = "http://apihawksdemo.services-hawks.com/api/CreateBitacora";
    console.log(JSON.stringify(this.objtemp));
  //  var str = {"CODIGO":null,"FECHA_INGRESO":"2021-04-24T20:58:56.097Z","F_INGRESO":"13:41 24-04-2021","FECHA_SALIDA":"2021-04-24T20:58:56.097Z","F_SALIDA":"14:41 24-04-2021","CODIGO_VISITANTE":175,"NOMBRE_VISITANTE":"bfdskf","CEDULA_VISITANTE":"fbksjdf","EMPRESA_VISITANTE":"fnksd","FOTO_VISITANTE":"fnksdf","TIPO":"4","AREA_VISITA":"fbdsf","RESPONSABLE":"fnksdjf","OBSERVACION":"fsdf","CODIGO_TURNO":400,"CODIGO_PUNTO_CONTROL":3,"NOMBRE_PUNTO_CONTROL":"klhkl","CODIGO_SUCURSAL_CLIENTE":"kjbjk","NOMBRE_SUCURSAL_CLIENTE":"bmbm","DIRECCION_SUCURSAL_CLIENTE":"bmnbn","TELEFONO_SUCURSAL_CLIENTE":" mnbmn","CODIGO_USUARIO":18,"NOMBRE_USUARIO":"bmbm","TELEFONO_USUARIO":"bmnbmn","CANTIDAD_ADJUNTOS":"mnbmnb","LISTA_ADJUNTOS":"bmnbmn"};
    this.http1.setDataSerializer("json");
    // this.http1.sendRequest(url, { method: "post" ,data:str,serializer:"json",responseType:"text"}).then((data) => {
    //   console.log(data);
    //   this.data = JSON.parse(data.data);
    // }, (err) => {
    //   console.log(err);
    //   //alert(JSON.stringify(err));
    // })
    this.http1.post(url,this.objtemp,{ "Content-Type": "application/json"}).then((res)=>{
      alert(JSON.stringify(res));
    },(err)=>{
      alert(JSON.stringify(err));
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
