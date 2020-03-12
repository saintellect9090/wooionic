import { Component, ViewChild} from '@angular/core';

import { Platform, NavController, ModalController, AlertController, ToastController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as WC from 'woocommerce-api';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CartPage } from './cart/cart.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {
  @ViewChild('myNav') nav: NavController

  public WooCommerce: any;
  public appPages = [];
  public loggedIn :  boolean =  false;
  public user : any;
  public username : string = '';
  public userData : any;
  public items : number;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalCtrl : ModalController,
    private router : Router,
    private storage : Storage,
    private alertContrl : AlertController,
    private toastControl : ToastController,
    private events : Events
   
  ) {
   this.storage.ready().then(()=>{
    this.storage.get("userLoginInfo").then((data)=>{
    
        if(data != null){
          this.loggedIn = true;
          this.user = data.user
          this.username = this.user.displayname;
        }
        else{
          this.loggedIn = false;
          this.user = {};
          this.username = 'User';
        }
      
      })
      });
 
    this.initializeApp();
this.WooCommerce = WC({
  url: 'http://saiswebhost.com/demo/pink-pitara/', // Your store URL
  consumerKey: 'ck_6dbfb09d4d1c6e5c539665929baf88b5015d09cf', // Your consumer key
  consumerSecret: 'cs_b393f1ae3ce0ac96a2e8851d50a361115cf11aea'  , // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: 'wc/v3',
  verifySsl: false,
  queryStringAuth: true // WooCommerce WP REST API version
})

this.WooCommerce.getAsync("products/categories").then((data)=>{

  let temp : any[]= JSON.parse(data.body);

  for (let i = 0 ; i< temp.length ; i++){
    if(temp[i]){
    this.appPages.push(temp[i]);
  
    }
  }
  
},
(error)=>{
  console.log(error);
})
this.events.subscribe('user:signedIn', (userEventData) => {
  this.userData = this.storage.ready().then(()=>{
    this.storage.get("userLoginInfo").then((data)=>{
    
        if(data != null){
          this.loggedIn = true;
          this.user = data.user
          this.username = this.user.displayname;
        }
        else{
          this.loggedIn = false;
          this.user = {};
          this.username = 'User';
        }
      
      })
      });
 });

this.events.subscribe('items' , (cartLength) =>{
this.storage.ready().then(()=>{
  this.storage.get('cart').then((data)=>{
    this.items = data.length;
  })
})
})
    
}
async ionViewWillEnter(){

  await this.storage.ready().then(()=>{
    this.storage.get('cart').then((data)=>{
      this.items = data.length;
    })
  })
 }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    
  }

  gotoNav(page){
console.log(page.slug)
    this.router.navigate(['product-category', page.slug])
  
  }
  openPage(pageName: string) {
    if (pageName == "signup") {
      this.router.navigate(['signup']);
    }
    if (pageName == "login") {
      this.router.navigate(['login']);
    }
    if (pageName == 'logout') {
     this.check();
     console.log(this.user)
    }
    if (pageName == 'cart'){
      this.modalCtrl.create({
        component:CartPage
      }).then((alert)=> alert.present());
    }
  

}
async check(){
  const alert = await this.alertContrl.create({
    subHeader : 'Logout!',
    message : 'Are you sure to logout?',
    buttons : [{
      text : 'Cancel',
      role : 'Cancel',
      handler : ()=>{
        return
      }
    },{
      text : 'Logout',
      handler : ()=> {
        this.storage.remove("userLoginInfo").then(()=>{
          this.user = [];
          this.loggedIn = false;
        })
        this.toastControl.create({
          message : 'Sucessfully Logged Out',
          duration : 2000
        })
      }
    }]
  }); await alert.present(); 
}

}
