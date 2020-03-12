import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import * as WC from 'woocommerce-api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.page.html',
  styleUrls: ['./product-category.page.scss'],
})
export class ProductCategoryPage implements OnInit {
products : any[] ;
WooCommerce : any;
category : any;
  constructor(private actRoute : ActivatedRoute) { 
    // this.category = this.navParam.get('category');
    
    this.WooCommerce = WC({
      url: 'http://saiswebhost.com/demo/pink-pitara/', // Your store URL
      consumerKey: 'ck_6dbfb09d4d1c6e5c539665929baf88b5015d09cf', // Your consumer key
      consumerSecret: 'cs_b393f1ae3ce0ac96a2e8851d50a361115cf11aea'  , // Your consumer secret
      wpAPI: true, // Enable the WP REST API integration
      version: 'wc/v3', // WooCommerce WP REST API version
      verifySsl: false,
      queryStringAuth: true
    })
    this.WooCommerce.getAsync("products").then((data) => {
    let temp : any[] = JSON.parse(data.body);

    for(let i= 0 ; i< temp.length ; i++){
    let categories : any [] = temp[i].categories
      for(let j = 0 ; j < categories.length; j++)
      if(categories[j].slug == this.category)
      this.products.push(temp[j]);
   
     
    
    }
    }, (err) => {
      console.log(err)
    })

  }

  ngOnInit() {
    this.products = [];
    this.category =  this.actRoute.snapshot.paramMap.get('category');
    console.log(this.category);
  }

}
