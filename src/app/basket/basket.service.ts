import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
// import { throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

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

    configUrl = 'assets/config.json';
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

    // We aren't going to use the below for now, as it requires setting up a server side API to get
    // around Paddle CORS restrictions; we could set that up in Node / Express, but we will just build the
    // subscriptions and add ons statically for now
    /*
    vendorId = 34736;
    vendorAuthCode = "d8c55da9085d35e7aead545d3fbfc88cddaf8eb8e2f495340d";
    rootUrl = "https://vendors.paddle.com/api/2.0";

    public getSubscriptionPlans() {
        return this.http.post<JSON> (this.rootUrl + "/subscription/plans", {
            vendor_id: this.vendorId, 
            vendor_auth_code: this.vendorAuthCode
        }, httpOptions)
        .pipe(
            catchError(this.handleError)
        );
    }

    public getProducts() {

    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
      };
      */
}