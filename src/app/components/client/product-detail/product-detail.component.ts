import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/_service/cart.service';
import { ProductService } from 'src/app/_service/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [MessageService]
})
export class ProductDetailComponent implements OnInit {

  id: any;
  product: any;
  listProductCategory: any;
  listNewestProduct: any;
  listItemInCart: any;
  @ViewChild('image') image !: ElementRef;

  constructor(private route: ActivatedRoute,private productService: ProductService,private router: Router,private cartService: CartService,private messageService:MessageService){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getProduct();
    this.cartService.loadCart();
  }

  getProduct(){
    this.productService.getProdct(this.id).subscribe({
      next: res =>{
        this.product = res;
        this.getListProductCategory(res.category.id,res.id);
        this.getListNewestProduct();
      },error: err=>{
        console.log(err);
      }
    })
  }

  getListProductCategory(id: number,productId: number){
    this.productService.getProductByCategory(id,productId).subscribe({
      next: res=>{
        this.listProductCategory = res;
      },error: err =>{
        console.log(err);
      }
    })
  }

  getListNewestProduct(){
    this.productService.getNewestProduct(this.id).subscribe({
      next: res =>{
        this.listNewestProduct = res;
      },error: err =>{
        console.log(err);
      }
    })
  }

  changeImage(event: any){
    let data = event.target.src;    
    this.image.nativeElement.src = data;
  }

  changeProduct(id:number){
    this.router.navigate(['/product',id]);
  }

  addTocart(item: any){
    if(!this.cartService.productInCart(item)){
      item.quantity = 1;
      this.cartService.addToCart(item);
      this.listItemInCart = this.cartService.getItem();
      this.showSuccess("Thêm vào giỏ hàng thành công")     
    }else{
      this.showWarn("Sản phẩm đã có trong giỏ hàng")
    }
  }


  showSuccess(text: string) {
    this.messageService.add({severity:'success', summary: 'Success', detail: text});
  }
  showError(text: string) {
    this.messageService.add({severity:'error', summary: 'Error', detail: text});
  }

  showWarn(text: string) {
    this.messageService.add({severity:'warn', summary: 'Warn', detail: text});
  }
}
