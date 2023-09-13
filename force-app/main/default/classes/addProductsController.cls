public with sharing class addProductsController {

    @AuraEnabled
    public static list<String> gettypes(){
        list<String> types = new list<String>();
        Schema.DescribeFieldResult fieldResult = Product2.Types__c.getDescribe();
       	List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry s:ple){
            types.add(String.valueOf(s.getLabel()));
        } 
        return types;
    }

    @AuraEnabled
    public static list<OpportunityLineItem> getopproducts(String oppid){
        try {
            return [Select Quantity,UnitPrice,ServiceDate,Product2.Name From OpportunityLineItem Where OpportunityId =: oppid];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }



    @AuraEnabled(cacheable=true)
    public static String getPriceBook(String recid){
        try {
            return [Select Pricebook2Id From Opportunity Where Id =: recid].Pricebook2Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static list<productwrapper> getProducts(String pricebookid){
        list<productwrapper> pw = new list<productwrapper>();
        try {
            for(PriceBookEntry pbe : [Select UnitPrice,Product2.Name,Product2.ProductCode,Product2.Description,Product2.Family,Product2.Id,Product2.StockKeepingUnit,Product2.Types__c From PriceBookEntry Where Pricebook2Id =: pricebookid]){
                pw.add(new productwrapper(pbe));
            }
            return pw;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String createopplineitem(Object jsonstg,String oppid,String Pricebookentryid){
        try{
            list<OpportunityLineItem> oli = (List<OpportunityLineItem>) JSON.deserialize(JSON.serialize(jsonstg) , list<OpportunityLineItem>.class);
            list<OpportunityLineItem> newoppli = new list<OpportunityLineItem>();
            if (!oli.isEmpty()) {
                for(OpportunityLineItem olis : oli){
                  if(olis.UnitPrice == null){
                    olis.UnitPrice = [Select UnitPrice From PriceBookEntry Where Pricebook2Id =: Pricebookentryid  AND Product2Id =: olis.Product2Id].UnitPrice;
                  }
                  OpportunityLineItem olism = new OpportunityLineItem(Quantity = olis.Quantity,UnitPrice = olis.UnitPrice , Product2Id = olis.Product2Id, OpportunityId = oppid, Description = olis.Description , ServiceDate  = olis.ServiceDate);
                  newoppli.add(olism);
                }
                system.debug(newoppli);
                if(!newoppli.isEmpty()){
                    insert newoppli;
                }
                return 'Success';
            }
            else {
                return 'Error';
            }
            
        }
        catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

	@AuraEnabled
    public static list<OpportunityLineItem> editoppitem(String recid){
        return [Select Product2.Name,Quantity,UnitPrice, ServiceDate,Description From OpportunityLineItem Where OpportunityId =: recid];
    }

    @AuraEnabled
    public static String updateopplineitem(Object jsonstg){
        list<OpportunityLineItem> updatelistoli = (list<OpportunityLineItem>) JSON.deserialize(JSON.serialize(jsonstg),list<OpportunityLineItem>.class);
        if(!updatelistoli.isEmpty()){
            update updatelistoli;
            return 'Success';
        }
        else{
            return 'Error';
        }
    }
    public class productwrapper{
        @AuraEnabled 
        public String Product2Id;
        @AuraEnabled 
        public String productName;
        @AuraEnabled 
        public String productCode;
        @AuraEnabled 
        public Decimal unitPrice;
        @AuraEnabled 
        public String productDescription;
        @AuraEnabled 
        public String productFamily;
        @AuraEnabled
        public String productlink;
        @AuraEnabled
        public String productsku;
        @AuraEnabled
        public String producttype;
        
        public productwrapper(PriceBookEntry pbe){
            this.producttype = pbe.Product2.Types__c;
            this.productsku = pbe.Product2.StockKeepingUnit;
            this.Product2Id = pbe.Product2Id;
            this.productName = pbe.Product2.Name;
            this.productCode = pbe.Product2.ProductCode;
            this.unitPrice = pbe.UnitPrice;
            this.productDescription = pbe.Product2.Description;
            this.productFamily = pbe.Product2.Family;
            this.productlink = '/' + pbe.Product2Id;
        }
        
    }
}