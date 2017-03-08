// import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

// /*
//   Generated class for the ImageLoader provider.

//   See https://angular.io/docs/ts/latest/guide/dependency-injection.html
//   for more info on providers and Angular 2 DI.
// */
// @Injectable()
// export class ImageLoader {

//   constructor(public http: Http) {
//     console.log('Hello ImageLoader Provider');
//   }
  
//   dbImages: any = {}
//   imageUrls: any = {}
  
  
//   getImage({imageUrl, dbId}) {
//     return http.get({})
//     .then((err, res) => {
      
//       if(res.status !== 200 || err)
//         return err;
        
//       if(imageUrl) {
//         this.imageUrls[imageUrl] = res.data;
//       } else if(dbId) {
//         this.dbImages[dbId] = res.data;
//       }
      
//       return res.data;
//     });
//   }

// }
