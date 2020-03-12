import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController, Events, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {
cartItems : any[] = [];
total : any;
showEmptyCartMessage : boolean = true ;
items: any;
total_items: any;
  constructor(private storage : Storage,  private modalCtrl : ModalController,
     private toastCntrl : ToastController,  private event :Events ,private loadingController : LoadingController) { 
   
      this.total = 0.0
   console.log(this.cartItems);
   
     }

    
ionViewWillEnter(){
  this.presentLoading();
       this.storage.ready().then(()=>{
        this.storage.get('cart').then((data)=>{
          this.cartItems= data;
          if(this.cartItems.length == 0){
            this.showEmptyCartMessage = true;
           return
          }
         else{
          this.showEmptyCartMessage = false;
            this.cartItems.forEach((item ,index)=>{
            this.total = this.total + (parseFloat(item.product.price) * item.qty);
            })
         }
          
        },
        (err)=>{
          console.log(err);
        })
      })
     }
  removeItem(pro, i){
    let price = pro.product.price;
    let qty = pro.qty;
    this.cartItems.splice(i ,1);
    this.storage.set("cart", this.cartItems).then(()=>{
      this.total = this.total - (price * qty);
    });
    if(this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
    }
  }
  async closeModal() {
    await this.modalCtrl.dismiss();

  }
  changeQty(pro, i, change){
    this.total = 0.0
    let qty = 0;
    let price = 0;
    qty = pro.qty;
    price = parseFloat(pro.product.price);
    if(change < 0 && pro.qty == 1){
      for(let i=0 ; i < this.cartItems.length ; i++){
        this.total = this.total + (parseFloat(this.cartItems[i].product.price) * this.cartItems[i].qty)
      }
      return;
    }
  pro.qty = qty + change
  pro.ammount = price * pro.qty;
  this.cartItems[i] = pro;
  this.storage.set("cart", this.cartItems).then(()=>{
    console.log("updated");
    this.cartItems.forEach((item, index)=>{
      this.total = this.total + (parseFloat(item.product.price) * item.qty);
    })
    this.toastCntrl.create({
      message :'Cart Value Updated',
      color: 'dark',
      duration : 1000
    }).then((alert)=> alert.present());
  })
  }
  ionViewWillLeave(){
    this.event.publish('items', this.items = this.storage.set("cart", this.cartItems).then((data)=>{
      
    }))
  }
  async presentLoading() {
    return  await this.loadingController.create({
        message: 'Please Wait',
        duration: 2000
      }).then((alert)=>(alert.present()));
      
    
    }
}
