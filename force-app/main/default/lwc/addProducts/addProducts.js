import { LightningElement, api, track, wire } from 'lwc';
import getPriceBook1 from '@salesforce/apex/addProductsController.getPriceBook';
import getproducts from '@salesforce/apex/addProductsController.getProducts';
import createopplineitem from '@salesforce/apex/addProductsController.createopplineitem';
import gettypes from '@salesforce/apex/addProductsController.gettypes'
import { CloseActionScreenEvent } from 'lightning/actions';
import modal from '@salesforce/resourceUrl/model';
import { loadStyle} from 'lightning/platformResourceLoader';

const columns = [
    {label : 'Product Name' , fieldName : 'productlink' , type : 'url' , typeAttributes : {label : {fieldName : 'productName'},target : '_parent'} },
    {label : 'Product Code' , fieldName : 'productCode'},
    {label : 'Product SKU' , fieldName : 'productsku'},
    {label : 'Product Type' , fieldName : 'producttype'},
    {label : 'Unit Price' , fieldName : 'unitPrice' , type : 'currency'},
    {label : 'Product Description' , fieldName : 'productDescription'},
    {label : 'Product Family' , fieldName : 'productFamily'},

];
const columns1 = [
    {label : 'Product Name' , fieldName : 'productlink' , type : 'url' , typeAttributes : {label : {fieldName : 'productName'},target : '_parent'}},
    {label : 'Quantity',fieldName : 'Quantity' , editable : true},
    {label : 'Sales Price',fieldName : 'unitPrice' , editable : true , type : 'currency'},
    {label : 'Date',fieldName : 'ServiceDate' , editable : true , type : 'date-local'},
    {label : 'Line Description',fieldName : 'Description' , editable : true},

];
export default class AddProducts extends LightningElement {

    spinner = true;
    @api recordId;
    draftValues;
    value;
    datatable = true;
    selecteddatatable = false;
    @track data;
    @track filtereditems;
    data1 = [];
    columns = columns;
    columns1 = columns1;
    @track selectedRows = [];
    options;
    errors;
    nextstep = true;

    connectedCallback(){
        Promise.all([
            loadStyle(this, modal)
        ])
    }
    // renderedCallback(){
    //     console.log(this.recordId + 'this is recordId');
    //     getPriceBook1({recid : this.recordId}).then(result => {
    //         this.value = result;
    //         this.getproducts(result);
    //     })
    // }
    @wire(getPriceBook1,{recid : '$recordId'})
    wireddata(data , error){
        if(data){
            console.log(this.recordId + 'this is reocds');
            console.log(data.data + 'this is pricebook id');
            this.value = data.data;
            console.log(this.value);
            this.getproducts(data.data);
        }
        if(error){
            console.log('error is comming');
            console.error(error.data);
        }
    }


    getproducts(value){
        getproducts({ pricebookid : value }).then( data => {
            this.filtereditems = data.slice(0,10);
            this.data = data;
            console.log(data);
            this.spinner = false;
        }).catch(error => {
            console.log(error.message);
        })

        gettypes().then(result => {
            this.options = result.map(res => {
                return {label:res , value:res}
            })
            this.options.unshift(
                {label:'All Types' , value:'AllTypes'}
            );
        })
    }
    @api getselectedproducts(){
        this.datatable = false;
        this.selecteddatatable = true;
        this.selectedRows.forEach(eles => {
            console.log(eles);
            this.data1.push(...this.data.filter(ele => ele.Product2Id == eles));
        })
        this.nextstep = false;
        
    }

    onRowSelection(event){
        let updatedItemsSet = new Set();
        let selectedItemsSet = new Set(this.selectedRows);
        let loadedItemsSet = new Set();
        this.filtereditems.map((ele) => {
            loadedItemsSet.add(ele.Product2Id);
        });
        if (event.detail.selectedRows) {
            event.detail.selectedRows.map((ele) => {
                updatedItemsSet.add(ele.Product2Id);
            });
            updatedItemsSet.forEach((Product2Id) => {
                if (!selectedItemsSet.has(Product2Id)) {
                    selectedItemsSet.add(Product2Id);
                }
            });
        }
        loadedItemsSet.forEach((Product2Id) => {
            if (selectedItemsSet.has(Product2Id) && !updatedItemsSet.has(Product2Id)) {
                selectedItemsSet.delete(Product2Id);
            }
        });
        this.selectedRows = [...selectedItemsSet];
    }

    @api handlesave(){
    
        createopplineitem({jsonstg : this.draftValues, oppid : this.recordId , Pricebookentryid : this.value}).then(result => {
            this.draftValues = [];
            console.log('data is commng');
            console.log(result);
        })
        this.closemodel();
    }

    cellchanged(event){
        this.draftValues = event.target.draftValues;
        console.log(this.draftValues);
    }
    filtername(event){
        this.spinner = true;
        if(event.target.value == ''){
            this.filtereditems = this.data.slice(0,10);
            this.spinner = false;
        }
       else{
            this.filtereditems = this.data.filter(elem => elem.productName.toLowerCase().includes(event.target.value));
            this.template.querySelector('[data-id="datatable"]').selectedRows = this.selectedRows;
            this.spinner = false;
       }
    }

    filtersku(event){
        this.spinner = true;
        if(event.target.value == ''){
            this.filtereditems = this.data.slice(0,10);
            this.spinner = false;
        }
        else{
                this.filtereditems = this.data.filter(elem => elem.productsku.toLowerCase().includes(event.target.value));
                this.template.querySelector('[data-id="datatable"]').selectedRows = this.selectedRows;
                this.spinner = false;
        }
        
    }
    filtertype(event){
        this.spinner = true;
        if(event.target.value == 'AllTypes'){
            this.filtereditems = this.data.slice(0,10);
            this.spinner = false;
        }
        else{
            this.value = event.target.value;
            this.filtereditems = this.data.filter(elem => elem.producttype == this.value);
            this.template.querySelector('[data-id="datatable"]').selectedRows = this.selectedRows;
            this.spinner = false;
        }
        
    }

    showall(){
        this.filtereditems = this.data;
    }
    closemodel(){
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}