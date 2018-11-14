import { Component, OnInit } from '@angular/core';
import { VolumeService } from './volume.service';

// Below is the Paddle global object from the Paddle CDN
declare var Paddle : any;

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.css']
})
export class VolumeComponent implements OnInit {

  constructor(private volumeService: VolumeService) {}

  ngOnInit() {
    Paddle.Setup({
        vendor: 33958
    });
  }

  myQuant = 1;

  myCheckout(prodId, quant) {
    Paddle.Spinner.show();

    this.volumeService.getCustomUrl(
        prodId,
        quant
        ).subscribe((data: any) => {
            if (quant > 10) {
                // UPSELL THE LARGER LICENSE
                Paddle.Checkout.open({
                    override: data.response.url
                });
            } else {
                Paddle.Checkout.open({
                    override: data.response.url
                });
            }
        });
    }
}
