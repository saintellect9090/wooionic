import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  username : string;
  constructor(private http:Http, private alert : AlertController,
     private router : Router, private toast : ToastController) { }

  ngOnInit() {
  }
  retrive(){
    this.http.get("http://saiswebhost.com/demo/pink-pitara/api/user/retrieve_password/?insecure=cool&user_login=" + this.username, ("Access-Control-Allow-Origin : *"))
  .subscribe((res)=>{
  const response = res.json().status
 if(response == 'ok'){
   this.preserntAlert();
 }
  
  },
  (err)=>{
  const errormsg = err.json().status
  if(errormsg == 'error'){
    this.toast.create({
      message : 'Your email id or username is not found.',
      showCloseButton : true
    }).then((alert)=>{
      alert.present();
    })
  }
  })
  }
  async preserntAlert(){
    const alert = await this.alert.create({
      message: 'Your password reset link is sent to your registered email. Kindly go through the process.',
      subHeader: 'Mail Sent!',
      buttons: [{
        text: "OK",
        handler: () => {
          this.router.navigate(['/'])
                
        }
      }]
     });
     await alert.present(); 
  }
}
