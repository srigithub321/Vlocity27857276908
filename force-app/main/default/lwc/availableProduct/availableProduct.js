import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from "vlocity_cmt/omniscriptBaseMixin";

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Price', fieldName: 'Price' },
    {type: "button", typeAttributes: {  
        label: 'Add to Order',  
        name: 'Add to Order',  
        title: 'Add to Order',  
        disabled: false,  
        value: 'Add to Order',  
        iconPosition: 'left'  
    }}, 
];

export default class AvailableProduct extends OmniscriptBaseMixin(LightningElement) {

    @api avaPdts;
    @api orderId;
    orderPdts = [];
    data = [];
    columns = columns;
    readOnlyOrder = false;
    //showData = false;
    temp = [];

    // receives price list based products data from omniscript 
    connectedCallback(){
        
    }

    // this function is triggered when Add to order button is clicked
    // handles all the requirement logic to update/insert order products in child component
    callRowAction(event){
       
        const pId = event.detail.row.ProductId;
        const pName = event.detail.row.Name;
        const pPrice = event.detail.row.Price;
        this.showData = true;

        // to check if product is already available in order and insert and update based on the result
        var found = this.orderPdts.find(e => e.ProductId == pId);
        
        if(typeof found !== 'undefined'){
            this.orderPdts.forEach(currentItem => {
                if(currentItem.ProductId ==  found.ProductId){
                    currentItem.Quantity = found.Quantity + 1;
                    if(found.Price == 0){
                        currentItem.TotalPrice = (currentItem.Quantity) * pPrice;
                        currentItem.Price = pPrice;
                    }
                    else{
                        
                        currentItem.TotalPrice = (currentItem.Quantity)*(currentItem.Price);
                    }
                    
                }
            })
        }
        else{
            // loop to add new product under order
            this.orderPdts.push({
                'ProductId':pId,
                'Name':pName,
                'Quantity':1,
                'Price':pPrice,
                'TotalPrice':pPrice,
                'OrderId':this.orderId

            });
        }
        
        this.orderPdts = [...this.orderPdts];
        

    }

    // this function is triggered when Activate button is clicked on order product component via event
    // hides the ui, so user can't add any products to order after clicking on activate button
    handlereadonly(event){
        this.readOnlyOrder = event.detail;

    }

    // triggered from custom event in Order Product components
    // this function is to display existing products in top and remaining products in after that as per requirement
    handleInitailData(event){
        
        this.orderPdts = event.detail;
        this.temp = this.avaPdts.filter((el) => {
            return !this.orderPdts.find((f) => {
              return f.ProductId === el.ProductId;
              });
            });
        this.data = [...this.orderPdts,...this.temp];

    }

}