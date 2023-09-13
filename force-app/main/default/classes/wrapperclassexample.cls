public with sharing class wrapperclassexample {


    public static list<accountWrapperClass> getaccounts(){
        list<accountWrapperClass> lstaccwrp = new list<accountWrapperClass>();
        for (Account acco : [SELECT id,Name From Account]) {
            lstaccwrp.add(new accountWrapperClass(acco));
        }
        return lstaccwrp;
    }





    public class accountWrapperClass{
        @AuraEnabled
        public Account acc;
        @AuraEnabled
        public String acclink;

        public accountWrapperClass(Account Acc){
            this.acc = acc;
            this.acclink = '/' + acc.id;
        }
    }
}