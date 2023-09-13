import { LightningElement, api, track} from 'lwc';
import getopproducts from '@salesforce/apex/addProductsController.getopproducts'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Products extends LightningElement {
    @api recordId;
    showaddproducts = false;
    showeditproducts = false
    next = true;
    @track data;

    connectedCallback(){
        getopproducts({oppid : this.recordId}).then(result => {
            this.data = result;
            console.log(result);
        })
    }

    showaddproductsmodel(){
        this.showaddproducts = true;
    }
    showeditproductmodel(){
        this.showeditproducts = true;
    }

    closemodel(){
        this.next = true;
        this.showaddproducts = false;
        this.showeditproducts = false;
    }

    nextstep(){
       this.next = false;
       console.log(this.template.querySelector('c-add-Products').getselectedproducts());
    }
    async savestep(){
        console.log(this.template.querySelector('c-add-Products').handlesave())
        this.showaddproducts = false;
    }
    displaytoast(event){
       this.dispatchEvent(new ShowToastEvent({
            title: 'Opportunity Line Item',
            message : event.detail.message,
            variant : event.detail.message
       }));
    }
    saveproduct(){
        console.log('hi');
        this.template.querySelector('c-edit-Products').handleSave();
    }
}