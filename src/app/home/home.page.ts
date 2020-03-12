import { Component, ViewChild, OnInit } from '@angular/core';
import * as WC from 'woocommerce-api';

import { ToastController, ModalController, IonSlides, Events, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartPage } from '../cart/cart.page';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{
  @ViewChild('registroWizard') registroWizard: IonSlides;

WooCommerce : any;
products : any[];
page : number;
moreproducts: any[];
 toast: any;
 searchQuery : any;
 items : any ;
 slideOpts: any;
 carItems:any
  constructor(private modalCntrl : ModalController,
     private toastCntrl : ToastController, private router : Router, 
     private storage : Storage,  private  loadingController : LoadingController) {
      this.slideOpts = {
        effect: 'fade'
      };
this.WooCommerce = WC({
  url: 'http://saiswebhost.com/demo/pink-pitara/', // Your store URL
  consumerKey: 'ck_6dbfb09d4d1c6e5c539665929baf88b5015d09cf', // Your consumer key
  consumerSecret: 'cs_b393f1ae3ce0ac96a2e8851d50a361115cf11aea'  , // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: 'wc/v3', // WooCommerce WP REST API version
  verifySsl: false,
  queryStringAuth: true
})



}
ngOnInit(){

}
async ionViewDidEnter(){
this.presentLoading();
  this.registroWizard.startAutoplay();
await  this.WooCommerce.getAsync("products").then((data)=>{
    this.products = JSON.parse(data.body);
  console.log(this.products);
   
  },
  (err)=>{
    console.log(err);
  })
  
}

slidesDidLoad(slides: HTMLIonSlidesElement) {
  slides.startAutoplay();
}
async ionViewWillEnter(){
this.storage.get('cart').then((data)=>{
  console.log(data.length);
})
this.searchQuery = '';


}
loadMore(event){
  if (this.products.length < this.products.length+1){
   
    this.toastCntrl.create({
      message:'No More Products',
      duration:5000,
      position: 'bottom'
    }).then(alert=> alert.present())
   
    event.target.disabled = true;
  
    
  }
}
openDetail(pro ){
 
   this.router.navigate(['product-details', JSON.stringify(pro.id)])
}
onSearch(event){
  if(this.searchQuery.length > 0){
this.router.navigate(['search',   this.searchQuery.toLowerCase()] )
// this.navCtrl.navigateRoot('/search' , this.searchQuery.toLowerCase());
}
}
openCart(){
  this.modalCntrl.create({
    component : CartPage
  }).then((alert)=> alert.present());
}
async presentLoading() {
  return  await this.loadingController.create({
      message: 'Please Wait',
      duration: 2000
    }).then((alert)=>(alert.present()));
    
  
  }
}