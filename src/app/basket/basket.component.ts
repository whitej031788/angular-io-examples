import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';

// Below is the Paddle global object from the Paddle CDN
declare var Paddle : any;

@Component({
    selector: 'app-basket',
    templateUrl: './basket.component.html',
    styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

    constructor(private basketService: BasketService) {}

    // Component view / model params for page
    subPlans = [];
    products = [];
    intPlans = [];
    loadedConfig = false;
    selectedPlan = undefined;
    selectedCallMe = [];
    selectedIntMins = [];

    ngOnInit() {
        let self = this;

        this.basketService.getConfig()
        .subscribe((data: any) => {
            this.subPlans = data.subscription_plans;
            this.products = data.add_ons;
            this.intPlans = data.int_mins;

            let prodString = "";
            prodString += this.appendProdIds(this.products);
            prodString += this.appendProdIds(this.subPlans);
            prodString += this.appendProdIds(this.intPlans);

            this.basketService.getPrices(prodString)
            .subscribe((data: any) => {
                data.response.products.forEach(prod => {
                    self.addPriceToObj(self.subPlans, 'id', prod.product_id, prod.price, prod.currency);
                    self.addPriceToObj(self.products, 'id', prod.product_id, prod.price, prod.currency);
                    self.addPriceToObj(self.intPlans, 'id', prod.product_id, prod.price, prod.currency);
                });

                self.loadedConfig = true;
                Paddle.Setup({
                    vendor: 33958
                });
            });
        });
    }

    private appendProdIds(arr) {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
           str += arr[i].id.toString() + ',';
        }
        return str;
    }

    private addPriceToObj(array, key, value, price, currency) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                array[i]['prices'] = price;
                array[i]['currency'] = currency;
                array[i]['currency_symbol'] = this.currencySymbol(currency);
            }
        }
    }

    private currencySymbol(currency) {
        let curTable = {
            'USD': '$', // US Dollar
            'EUR': '€', // Euro
            'CRC': '₡', // Costa Rican Colón
            'GBP': '£', // British Pound Sterling
            'ILS': '₪', // Israeli New Sheqel
            'INR': '₹', // Indian Rupee
            'JPY': '¥', // Japanese Yen
            'KRW': '₩', // South Korean Won
            'NGN': '₦', // Nigerian Naira
            'PHP': '₱', // Philippine Peso
            'PLN': 'zł', // Polish Zloty
            'PYG': '₲', // Paraguayan Guarani
            'THB': '฿', // Thai Baht
            'UAH': '₴', // Ukrainian Hryvnia
            'VND': '₫', // Vietnamese Dong
        }

        return curTable[currency];
    };

    addSubToArray(plan) {
        this.selectedPlan = plan;
    }

    removeSelectedPlan() {
        this.selectedPlan = undefined;
    }

    addCallMeItem(item) {
        this.selectedCallMe.push(item);
    }

    removeCallMeItem(item) {
        const index: number = this.selectedCallMe.indexOf(item);
        if (index !== -1) {
            this.selectedCallMe.splice(index, 1);
        }        
    }

    addIntMins(item) {
        this.selectedIntMins.push(item);
    }

    removeIntMins(item) {
        const index: number = this.selectedIntMins.indexOf(item);
        if (index !== -1) {
            this.selectedIntMins.splice(index, 1);
        }      
    }

    myCheckout() {
        if (!this.selectedPlan) {
            alert('You must select a monthly plan before proceeding');
            return;
        }

        Paddle.Spinner.show();

        this.basketService.getCustomUrl(
            this.selectedPlan.id,
            this.selectedPlan.currency + ':' + this.pricingTotal.onetime.gross.toString(),
            this.selectedPlan.currency + ':' + this.pricingTotal.gross.toString(),
            this.selectedPlan.currency
            ).subscribe((data: any) => {
                Paddle.Checkout.open({
                    override: data.response.url
                })
            });
    }

    get pricingTotal() {
        let retObj = {
            net: 0,
            gross: 0,
            tax: 0,
            currency: "",
            currency_symbol: "",
            onetime: {
                net: 0,
                gross: 0,
                tax: 0
            }
        };
        if (this.selectedPlan) {
            retObj.net += this.selectedPlan.prices.net;
            retObj.gross += this.selectedPlan.prices.gross;
            retObj.tax += this.selectedPlan.prices.tax;
            retObj.onetime['net'] += this.selectedPlan.prices.net;
            retObj.onetime['gross'] += this.selectedPlan.prices.gross;
            retObj.onetime['tax'] += this.selectedPlan.prices.tax;
            retObj.currency = this.selectedPlan.currency;
            retObj.currency_symbol = this.selectedPlan.currency_symbol;
        }
        this.selectedCallMe.forEach(elem => {
            retObj.net += elem.prices.net;
            retObj.gross += elem.prices.gross;
            retObj.tax += elem.prices.tax;
            retObj.onetime['net'] += elem.prices.net;
            retObj.onetime['gross'] += elem.prices.gross;
            retObj.onetime['tax'] += elem.prices.tax;
        });
        this.selectedIntMins.forEach(elem => {
            retObj.onetime['net'] += elem.prices.net;
            retObj.onetime['gross'] += elem.prices.gross;
            retObj.onetime['tax'] += elem.prices.tax;
        });
        return retObj;
    }
    
    title = "Paddle Basket";
}
