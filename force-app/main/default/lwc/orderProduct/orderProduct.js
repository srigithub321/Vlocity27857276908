import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from "vlocity_cmt/omniscriptBaseMixin";
//import pubsub from 'vlocity_cmt/pubsub';
import { OmniscriptActionCommonUtil } from 'vlocity_cmt/omniscriptActionUtils';

const columns = [
  
    { label: 'Name', fieldName: 'Name' },
    { label: 'Quantity', fieldName: 'Quantity' },
    { label: 'Unit Price', fieldName: 'Price' },
    { label: 'Total Price', fieldName: 'TotalPrice' }
];

export default class OrderProduct extends OmniscriptBaseMixin(LightningElement) {
@api dispPdts;
@api oid;
confirmPdts;
columns = columns;
showUI = false;




connectedCallback(){
    
    //initalize action utility class to call vlocity integration procedure
    this._actionUtilClass = new OmniscriptActionCommonUtil();

    // call ip to get existing products
    let ipparam={ 
        orderId: this.oid
    };
    

    const iniparams = {
        input: JSON.stringify(ipparam),
        sClassName: 'vlocity_cmt.IntegrationProcedureService',
        sMethodName: 'KPN_GetOrderPdts',
        options: '{}',
    };

    // call KPN_GetOrderPdts IP to get inital products that are available in order
    this._actionUtilClass
            .executeAction(iniparams, null, this, null, null)
            .then(response => {
                if(response.result.IPResult != undefined){
                    
                    this.dispPdts = response.result.IPResult;
                    

                    //send initial order product data to parent component
                    var cEventIni = new CustomEvent("inidata",{
                        detail:this.dispPdts
                    });

                    this.dispatchEvent(cEventIni);

                }
             })
            .catch(error => {   
              console.log('Error message' + error);
            });
            

        
}

renderedCallback(){
    
}

// triggered when Activate Button is Clicked. 
// this functon involes KPN_Assign Integration procedure to update/insert order products to mentioned order
handleClick(event){
    this.confirmPdts = true;
    
    var cEvent = new CustomEvent("readonlyorder",{
        detail:this.confirmPdts
    });

    this.dispatchEvent(cEvent);

    let inputparam={ 
        alldata: this.dispPdts,
        orderId: this.oid
    };
    
    const params = {
        input: JSON.stringify(inputparam),
        sClassName: 'vlocity_cmt.IntegrationProcedureService',
        sMethodName: 'KPN_Assign',
        options: '{}',
    };

    

    this._actionUtilClass
            .executeAction(params, null, this, null, null)
            .then(response => {
				console.log('IP data---'+JSON.stringify(response));
             })
            .catch(error => {   
              console.log('Error message' + error);
            });

   
}

}