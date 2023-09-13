import { LightningElement } from 'lwc';
import getRandomReciepe from '@salesforce/apex/spoonacularintegratio.getRandomReciepe'

export default class Spoonacular extends LightningElement {
    data;
    instructions;
    connectedCallback(){
        getRandomReciepe().then( result => {
            this.data = result.recipes;
            console.log(result);
            console.log(result.recipes);
            //console.log(this.data.recipes[0].image);
        })
    }
}