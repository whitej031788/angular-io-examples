import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})

export class BasketService {
    constructor(private http: HttpClient) {}

    configUrl = 'assets/config-basket.json';
    pricingApi = 'https://checkout.paddle.com/api/2.0/prices?product_ids=';
    customApi = 'http://localhost:8888/api/generate-link'

    getConfig() {
        return this.http.get(this.configUrl);
    }

    getPrices(priceStr) {
        return this.http.jsonp(this.pricingApi + priceStr, 'callback');
    }

    getCustomUrl(subId, initPrice, recurPrice, myCur) {
        return this.http.post(this.customApi, {product_id: subId, prices: initPrice, recurring_prices: recurPrice, currency: myCur}, httpOptions);
    }
}