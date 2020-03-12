import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
 
  { path: 'product-category/:category', loadChildren: './product-category/product-category.module#ProductCategoryPageModule' },
  { path: 'product-details/:id', loadChildren: './product-details/product-details.module#ProductDetailsPageModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'search/:query', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutPageModule' },
  { path: 'forgot', loadChildren: './forgot/forgot.module#ForgotPageModule' }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
