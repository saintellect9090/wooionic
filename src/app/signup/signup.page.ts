import { Component, OnInit } from '@angular/core';
import * as WC from 'woocommerce-api';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';





@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any;

  constructor(private toastCtrl : ToastController, private alertCtrl :AlertController , private router : Router) {
    this.newUser.billing= {};
    this.newUser.billing.phone 
    this.newUser.shipping = {};
    this.billing_shipping_same = false; 
    this.WooCommerce = WC({
      url: 'http://saiswebhost.com/demo/pink-pitara/', // Your store URL
      consumerKey: 'ck_6dbfb09d4d1c6e5c539665929baf88b5015d09cf', // Your consumer key
      consumerSecret: 'cs_b393f1ae3ce0ac96a2e8851d50a361115cf11aea'  , // Your consumer secret
      wpAPI: true, // Enable the WP REST API integration
      version: 'wc/v3', // WooCommerce WP REST API version
      queryStringAuth: true
    })

}

  ngOnInit() {
 this.WooCommerce.getAsync('customers').then((data)=>{
   console.log(JSON.parse(data.body));
 })

  }
  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;
  }
  checkEmail(){

    let validEmail = false;

    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(reg.test(this.newUser.email)){
      //email looks valid

      this.WooCommerce.getAsync('customers').then( (data) => {
       
        let temp : any[]=  JSON.parse(data.body);
        for(let i = 0 ; i < temp.length ;  i++ ){
       
          if(  (temp[i].email === this.newUser.email) ){
            this.toastCtrl.create({
              message: "Email is already registered. Please Login",
              showCloseButton: true
            }).then((alert)=> {alert.present()});
            return ;
          }
          else{
            this.toastCtrl.create({
              message: "Email Is good to go",
              duration: 1000
            }).then((alert)=> {alert.present()});
         
          }
        }

      })



    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: "Invalid Email. Please check.",
        showCloseButton: true
      }).then((alert)=> {alert.present()});
      console.log(validEmail);
    }

  }
  checkUser(){

 
this.WooCommerce.getAsync('customers').then((data)=>{
 let temp : any[]=  JSON.parse(data.body);
for(let i = 0 ; i < temp.length ;  i++ ){

  if(  this.newUser.username.length > 0  && (temp[i].username === this.newUser.username) ){
    this.toastCtrl.create({
      message: "Username already registered. Please check.",
      showCloseButton: true
    }).then((alert)=> {alert.present()});
    return ;
  }
  else{
    this.toastCtrl.create({
      message: "Congratulations. Username is good to go.",
      duration: 1000
    }).then((alert)=> {alert.present()});
 
  }
}
})
    } 

signup(){
  let Data = {
    email: this.newUser.email,
    first_name: this.newUser.first_name,
    last_name: this.newUser.last_name,
    username: this.newUser.username,
    password: this.newUser.password,
    billing: {
      first_name: this.newUser.first_name,
      last_name: this.newUser.last_name,
      company: '',
      address_1:  this.newUser.billing.address_1,
      address_2: this.newUser.billing.address_2,
      city: this.newUser.billing.city,
      state: this.newUser.billing.state,
      postcode: this.newUser.billing.postcode,
      country:  this.newUser.billing.country,
      email: this.newUser.email,
      phone:   this.newUser.billing.phone,
    },
    shipping: {
      first_name: this.newUser.first_name,
      last_name: this.newUser.last_name,
      company: '',
      address_1: this.newUser.shipping.address_1,
      address_2: this.newUser.shipping.address_2,
      city:  this.newUser.shipping.city,
      state: this.newUser.shipping.state,
      postcode: this.newUser.shipping.postcode,
      country: this.newUser.shipping.country
    }
  }
  // let Data = {
  //   email: 'jo.doe@example.com',
  //   first_name: 'John',
  //   last_name: 'Doe',
  //   username: 'john.doee',
  //   billing: {
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     company: '',
  //     address_1: '969 Market',
  //     address_2: '',
  //     city: 'San Francisco',
  //     state: 'CA',
  //     postcode: '94103',
  //     country: 'US',
  //     email: 'john.doe@example.com',
  //     phone: '(555) 555-5555'
  //   },
  //   shipping: {
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     company: '',
  //     address_1: '969 Market',
  //     address_2: '',
  //     city: 'San Francisco',
  //     state: 'CA',
  //     postcode: '94103',
  //     country: 'US'
  //   }
  // };
  

  if(this.billing_shipping_same){
    Data.shipping = Data.billing;
  }

 

  if(this.billing_shipping_same){
    this.newUser.shipping = this.newUser.shipping;

  }
console.log(Data);
   this.WooCommerce.postAsync('customers' , Data  ).then( (data) => {

    let response = (JSON.parse(data.body));
    console.log(response);
    if(response.id){
      this.alertCtrl.create({
        message: "Your account has been created successfully! Please login to proceed.",
        buttons: [{
          text: "Login",
          handler: ()=> {
          this.router.navigate(['/login'])
          }
        }]
      }).then((alert)=> { alert.present()});
    } else if(response.data.status == 400){
      this.toastCtrl.create({
        message: response.message,
        showCloseButton: true
      }).then((alert)=> {alert.present()});
    }
    else {
      this.toastCtrl.create({
        message : 'Unexpected Error Occured' ,
        showCloseButton : true
      }).then((alert)=> alert.present());
    }
  })

 

}
}
