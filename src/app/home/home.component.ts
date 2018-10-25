import { Component, OnInit } from '@angular/core';
import { Router, Route } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.myRoutes = this.routeArray('', this.router.config);
    // this.printpath('', this.router.config);
  }

  myRoutes = [];

  printpath(parent: String, config: Route[]) {
    for (let i = 0; i < config.length; i++) {
      let r = config[i];
      if (!r.path) {
        continue;
      } else {
        console.log(parent + '/' + r.path);
        if (r.children && r.path) {
          this.printpath(parent + '/' + r.path, r.children);
        }
      }
    }
  }

  routeArray(parent: String, config: Route[]) : Array<String> {
    let myArr = [];
    for (let i = 0; i < config.length; i++) {
      let r = config[i];
      if (!r.path) {
        continue;
      } else {
        myArr.push(r.path);
      }
    }
    return myArr;
  }
}
