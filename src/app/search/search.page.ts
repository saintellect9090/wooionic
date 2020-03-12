import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as WC from 'woocommerce-api';
import { ToastController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
queryParams : string = '';
WooCommerce : any;
showEmptyCartMessage : boolean = false;
products : any[] = [];

  constructor( private actRoute : ActivatedRoute, private toastCntrl : ToastController,
     private router : Router, private loadingController : LoadingController) { 
    this.WooCommerce = WC({
      url: 'http://saiswebhost.com/demo/pink-pitara/', // Your store URL
      consumerKey: 'ck_6dbfb09d4d1c6e5c539665929baf88b5015d09cf', // Your consumer key
      consumerSecret: 'cs_b393f1ae3ce0ac96a2e8851d50a361115cf11aea'  , // Your consumer secret
      wpAPI: true, // Enable the WP REST API integration
      version: 'wc/v3',
      verifySsl: false,
      queryStringAuth: true // WooCommerce WP REST API version
    })

    
  }

  ngOnInit() {
    this.queryParams = this.actRoute.snapshot.paramMap.get('query');
    this.showEmptyCartMessage = false;
  }
  async ionViewDidEnter(){
 this.presentLoading();
    await this.WooCommerce.getAsync("products").then((data)=>{
      let temp : any []=  JSON.parse(data.body);
      console.log(temp);
      for (let i = 0 ;  i< temp.length ; i++){
        if(temp[i].slug.match(this.queryParams)){
        this.products.push(temp[i]);
        console.log(this.products);
        }  
      }
      console.log(this.products.length);
      if(this.products.length == 0){
        this.showEmptyCartMessage = true;
      }
      else{
        this.showEmptyCartMessage = false;
      }
    })

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
  openDetail(pro){
    this.router.navigate(['product-details', JSON.stringify(pro.id)]);
  }
  async presentLoading() {
    return  await this.loadingController.create({
        message: 'Please Wait',
        duration: 1000
      }).then((alert)=>(alert.present()));
      
    
    }
}
