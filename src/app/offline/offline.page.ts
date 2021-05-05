import { Component, OnInit } from '@angular/core';
import {PopupPage} from "../popup/popup.page";
import {ModalController} from "@ionic/angular";


@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
  providers:[PopupPage]
})
export class OfflinePage implements OnInit {
  
    
   constructor(private modalCtrl:ModalController)
   {

   }
   ngOnInit()
   {

   }

   openPopUp()
   {
     this.modalCtrl.create({
       component:PopupPage,
       backdropDismiss:false,
       showBackdrop:true

     }).then((ele)=>{
       ele.present();
     })
   }


}
