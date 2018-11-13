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

export class VolumeService {
    constructor(private http: HttpClient) {}

    customApi = 'http://localhost:8888/api/generate-volume-discount'

    getCustomUrl(prodId, quantity) {
        return this.http.post(this.customApi, {product_id: prodId, quantity: quantity}, httpOptions);
    }
}