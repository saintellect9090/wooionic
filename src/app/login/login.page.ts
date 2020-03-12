import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, Events } from '@ionic/angular';

import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username : string;
  password : string;
  userdata : any;
  constructor(private router : Router, private toastCtrl : ToastController,
     private alertCtrl : AlertController, 
     private events : Events ,public http : Http, private storage : Storage) { }

  ngOnInit( ) {
this.username ='';
this.password ='';
  }
  login(){

    this.http.get("http://saiswebhost.com/demo/pink-pitara/api/auth/generate_auth_cookie/?insecure=cool&username=" + this.username + "&password=" + this.password
    , ("Access-Control-Allow-Origin : *"))
    .subscribe( (res) => {
      console.log(res.json());

      let response = res.json();

      if(response.status == 'error'){
        this.toastCtrl.create({
          message:response.error,
          duration: 5000
        }).then((alert)=> alert.present());
        return;
      }

this.events.publish('user:signedIn' , this.userdata = 
      this.storage.set("userLoginInfo", response).then( (data) =>{

        this.presentAlert();
       
      }))
      
    })
  }
signUp(){
  this.router.navigate(['/signup']);
}
async presentAlert() {
  const alert = await this.alertCtrl.create({
  message: 'You are logged in successfully',
  subHeader: 'Login Success!',
  buttons: [{
    text: "OK",
    handler: () => {
      this.router.navigate(['/'])
            
    }
  }]
 });
 await alert.present(); 
}
forgot(){
  this.router.navigate(['/forgot']);
}
}