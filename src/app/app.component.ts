import { Component, ViewEncapsulation, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SEOService } from './shared/seoservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class AppComponent {
  title = 'CDC-vaccine-issunance';
  routeMap = {
    "接種資料查詢" : "search",
    "接種資料創建" : "create"
  };
  constructor(private router: Router,
              private _SEOService : SEOService,
              private activatedRoute : ActivatedRoute) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    )
    .subscribe((event) => {
      if (event['title']) {
        this._SEOService.updateTitle(event['title']);
        //Updating Description tag dynamically with title
        this._SEOService.updateDescription(event['title'] + event['description']);
        $("a").removeClass("active");
        $(`.nav-link-${this.routeMap[event['title']]}`).addClass("active");
      }
    });
  }
}
