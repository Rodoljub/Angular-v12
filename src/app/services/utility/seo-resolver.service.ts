import { Injectable, Inject, PLATFORM_ID } from '../../../../node_modules/@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '../../../../node_modules/@angular/router';
import { ItemService } from '../rs/item.service';
import { isPlatformBrowser, isPlatformServer } from '../../../../node_modules/@angular/common';
import { localStorageConfig } from '../../../config/localStorageConfig';
import { ProfileService } from '../../features/accounts/services/profile.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ItemViewModel } from '../../features/items/item/ItemViewModel';
import { MetaTagsModel } from '../../shared/MetaTagsModel';
import { config } from '../../../config/config';
import { UtilityService } from './utility.service';
import { Meta, Title } from '@angular/platform-browser';

@Injectable(

)
export class SeoResolver implements Resolve<any> {

  itemsUrl = `${environment.rsURi}/api/items`
  profileUri = `${environment.rsURi}/api/profile`

  urlSegment: string;
  _route: ActivatedRouteSnapshot;
  _state: RouterStateSnapshot;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private router: Router,
    private utilityService: UtilityService,
    private titleService: Title,
    private metaService: Meta
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any>|Promise<any>|any {

    if (isPlatformBrowser(this.platformId)) {
      this._route = route;
      this._state = state;
      let itemModelList = localStorage.getItem(localStorageConfig.itemsModalList);
      if (itemModelList) {
        return JSON.parse(itemModelList);
      }

      if (route.params.id) {
        const url = `${this.itemsUrl}/${route.params.id}`;
        return this.httpClient.get(url)
        .toPromise()
          .then(item => {
            if (item) {
              return item;

            } else { // id not found
              console.log('404')
              // this.router.navigate(['/404']);
              return null;
            }
          })
      }
     }

    if (isPlatformServer(this.platformId)) {
      this._route = route;
      this._state = state;
      if (route.params.urlSegment) {
        return new Promise((resolve) => {
        this.urlSegment = route.params.urlSegment

        console.log('seo-resolver urlsegment route.routeConfig.path: ' + route.routeConfig.path)
        const url = `${this.profileUri}/userProfile/urlSegment/${this.urlSegment}`
        console.log('seo url: ' + url)
        return this.httpClient.get(url)
        // request('GET', url)
          .toPromise()
          .then(item => {
            if (item) {
              const urlSegment = this.urlSegment

              this.setUrlSegmentMetaTags(item, urlSegment)
              resolve({item, urlSegment});

            } else { // id not found
              console.log('404')
              // this.router.navigate(['/404']);
              resolve(null);
            }
          })
        })
      }
      // if (route.params.id) {
      if (route.routeConfig.path === 'aa/:id') {
      console.log('seo-resolver id route.routeConfig.path: ' + route.routeConfig.path)

      const url = `${this.itemsUrl}/${route.params.id}`;
      return this.httpClient.request('GET', url)
      .toPromise()
      .then((item: ItemViewModel) => {
          if (item) {
            console.log(item)
            const item1 = this.utilityService.mapJsonObjectToObject<ItemViewModel>(item);
            // console.log('map item')
            let metaTagsModel = this.setItemMetaTagsModel(item1)
            // console.log('meta tags')
            console.log(metaTagsModel)
            this.titleService.setTitle(item1.Tags.toString())
            this.setMetaTags(metaTagsModel)

            // this.removeCanonicalLink()

            return (item);
            
          } else { // id not found
            console.log('404')
            // this.router.navigate(['/404']);
            return null;
          }
        })
        .catch(err => {
          console.log('error: ' + err)
        })
      }

      if (route.routeConfig.path === 'media/:id') {
        const url = `${this.itemsUrl}/${route.params.id}`;
        return this.httpClient.get(url)
        .toPromise()
        .then((item: any) => {
            if (item) {
              console.log(item)
               let item1 = this.utilityService.mapJsonObjectToObject<ItemViewModel>(item);
               item1.FileDetails.imageAnalysis = JSON.parse(item.fileDetails.imageAnalysis)
              
               console.log(item1)
              // console.log('map item')
              let metaTagsModel = this.setItemMetaTagsModel(item1)
              // console.log('meta tags')
              console.log(metaTagsModel)
              
              this.setMetaTags(metaTagsModel)
  
              // this.removeCanonicalLink()
  
              return (item);
              
            } else { // id not found
              console.log('404')
              // this.router.navigate(['/404']);
              return null;
            }
          })
          .catch(err => {
            console.log('error: ' + err)
          })
      }
    }
    }
  removeCanonicalLink() {
    
    document.head.querySelectorAll("link").forEach(link => {
      // you can use link.remove() too, but this solution is more supported and polyfilled:
      if (link.rel === 'canonical') {
        link.parentNode.removeChild(link);
        console.log('Link rel canonical remove');
        console.log(link);
      }
      
        
     })
  }

    setUrlSegmentMetaTags(item, urlSegment) {
      console.log(item)
      let keywords = [urlSegment, item.name, 'Portfolio', config.titles.applicationTitle]
      let metaTagsModel = new MetaTagsModel(
        'website',
        item.name,
        'Portfolio',
        config.mediaImage + item.imagePath + config.jpegExtansion,
        environment.appDomain + this._state.url,
        config.titles.applicationTitle,
        keywords
      )
      console.log('meta tag Image url: ' + environment.appDomain + item.image);
      this.setMetaTags(metaTagsModel);
    }

    setItemMetaTagsModel(item: ItemViewModel): MetaTagsModel {
      let title = '';
      let description = '';
      const i = item.FileDetails.imageAnalysis;
      
      if (i && i.description && i.description.captions
            && i.description.captions.length > 0 
      ) {
              title = i.description.captions[0].text;
      } else if (
        i && i.description && i.description.tags
          && i.description.tags.length > 0
      ) {
        title = i.description.tags.toString();
      }

      if (item.Description === null) {
        description = item.Tags.toString();
      } else {
        description = item.Description
      }

      title = `${title} - Image - Occpy`
     
      // this.titleService.setTitle(title)

      let metaTagsModel = new MetaTagsModel(
        'website',
        title,
        description,
        config.mediaImage + item.ItemFilePath + config.jpegExtansion,
        environment.appDomain + this._state.url,
        config.titles.applicationTitle,
        item.Tags
      )
  
      console.log('state url: ' + this._state.url)
      return metaTagsModel;
    }

    setMetaTags(data: MetaTagsModel) {

      this.titleService.setTitle(data.Title)
      let type = data.Type
      let twitterDescription = data.Description;
      if(data.Description) {
        let descriptionLenght = data.Description.length;
  
        if (descriptionLenght > 200) {
          twitterDescription = data.Description.slice(200)[0];
        }
      }

      this.metaService.updateTag({ property: 'description', content: twitterDescription })
      this.metaService.updateTag({ property: 'og:url', content: data.Url })
      this.metaService.updateTag({ property: 'og:title', content: data.Title })
      this.metaService.updateTag({ property: 'og:type', content: data.Type })
      this.metaService.updateTag({ property: 'og:image', content: data.ImageUrl })
      this.metaService.updateTag(
        { property: 'og:image:secure_url', content: data.ImageUrl })
      this.metaService.updateTag({ property: 'og:site_name', content: data.SiteName })
      this.metaService.updateTag({ property: 'og:description', content: twitterDescription })
      this.metaService.updateTag({ property: 'title', content: data.Title })
      this.metaService.updateTag({ property: 'keywords', content: data.Keywords.toString() })
  
      this.metaService.updateTag({ name: 'twitter:description', content: twitterDescription })
      this.metaService.updateTag({ name: 'twitter:title', content: data.Title })
      this.metaService.updateTag(
        { name: 'twitter:image', content: data.ImageUrl })
    }
  }
