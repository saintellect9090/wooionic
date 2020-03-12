import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { ToastController, ModalController, Events, LoadingController } from '@ionic/angular';
import { CartPage } from '../cart/cart.page';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

productId: string;
WooCommerce : any;
status : boolean = false;
product : any[]= [];
length : any;
items :any;
carItems: any;
  constructor(private actRoute : ActivatedRoute, private storage : Storage, 
    private toastCntrl : ToastController,private loadingController :LoadingController,
     private modalCntrl : ModalController,private event : Events) {
    

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
  

  ngOnInit() {

// this.productId = this.actRoute.snapshot.paramMap.get('id');
// console.log(this.productId)
  }
async ionViewDidEnter(){
  this.presentLoading();
   const id = this.actRoute.snapshot.paramMap.get('id');
await this.WooCommerce.getAsync("products/" + id  ).then(
(data)=>{
  this.product = JSON.parse(data.body);

  if(this.product){
 
   this.status = true;
   
  }
  else{
   
  }
},
(err)=>{
  console.log(err);
})

}

addToCart(product){
 this.storage.get('cart').then((data)=>{
   if(data == null){
     data = [];
     data.push({
       "product" : product,
       "qty" : 1,
       "ammount" : parseFloat(product.price)
     });
     console.log(data);
   }
   else{
    let added = false;
    for( let i=0 ; i < data.length ; i++){
      if(product.id == data[i].product.id){
        console.log("product is already there")
        let qty = data[i].qty;
        data[i].qty = qty + 1;
        data[i].ammount = parseFloat(data[i].ammount) + parseFloat(data[i].product.price);
        added = true;
      }
    }
    if(!added){
      data.push({
        "product" : product,
        "qty" : 1,
        "ammount" : parseFloat(product.price)
      });
    }
   }
   this.event.publish('items', this.items = 
   this.storage.set('cart', data).then(()=>{
     console.log("product added");
     console.log(data);
     this.length = data.length;
     this.toastCntrl.create({
       message: 'Product Added',
       duration : 2000 ,
        position : 'bottom',
        color :'primary'
     }).then(alert=> alert.present())
   }))
 })
}
 openCart(){

const modal =  this.modalCntrl.create({
  component : CartPage
}).then(alert => alert.present())

}
async presentLoading() {
return  await this.loadingController.create({
    message: 'Please Wait',
    duration: 2000
  }).then((alert)=>(alert.present()));
  

}

}
