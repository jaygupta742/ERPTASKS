import { LightningElement, api, track } from 'lwc';
import editoppitem from '@salesforce/apex/addProductsController.editoppitem';
import updateopplineitem from '@salesforce/apex/addProductsController.updateopplineitem';
updateopplineitem
const columns = [
    {label : 'Product Name' ,fieldName : 'productlink' , type : 'url' , typeAttributes : { label : { fieldName : 'Name'} , target : '_parent'}},
    {label : 'Quantity' ,fieldName : 'Quantity' , editable : true},
    {label : 'Sales Price' ,fieldName : 'UnitPrice' , editable : true},
    {label : 'Date' ,fieldName : 'ServiceDate' , editable : true},
    {label : 'Line Description' ,fieldName : 'Description' , editable : true},

];
export default class Editoppitems extends LightningElement {
    @api recordid;
    columns = columns;
    @track data;
    draftValues;
    
    connectedCallback(){
        console.log(this.recordid);
        editoppitem({recid : this.recordid}).then(result => {
            console.log(result);
            result.forEach(res => {
                res.Name = res.Product2.Name;
                res.productlink = '/' + res.Product2.Id;
            });
            this.data = result;
        })
    }

    cellchanged(event){
        this.draftValues = event.target.draftValues;
        console.log(this.draftValues);
    }

    @api handleSave(){
        console.log(this.draftValues);
        updateopplineitem({jsonstg : this.draftValues}).then(result => {
            console.log(result);
        });
    }

}