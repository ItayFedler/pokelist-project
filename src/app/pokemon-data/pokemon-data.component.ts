import { ChangeDetectionStrategy,Component ,inject} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Observable, Subject } from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-pokemon-data',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatButtonModule,MatListModule],
  templateUrl: './pokemon-data.component.html',
  styleUrl: './pokemon-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PokemonDataComponent {
  http: HttpClient = inject(HttpClient);

  private pokemonDataSubject = new Subject<any[]>();
  pokemonJSON: any;
  pokemonData$: Observable<any> = this.pokemonDataSubject.asObservable();

  //sprites fix
  // private pokemonSPSubject = new Subject<any[]>();
  // pokemonSP:any = [];
  // pokemonSP$: Observable<any> = this.pokemonSPSubject.asObservable();


  constructor(private router: Router) {this.getPokemoneData();}



  getPokemoneData() {
    const url: string = this.router.url;
    var a = decodeURIComponent(url.replace('/pokemon_data;data=', ''));
    this.http.get<any>(a).subscribe(data => {
      this.pokemonJSON = data;
      this.pokemonDataSubject.next(data);
      
      // var pokemonSP2=[];
      // Object.keys(this.pokemonJSON.sprites).forEach(element => {
      //   // const sp=this.pokemonJSON.sprites
      //   // var a = sp[element];
      //   pokemonSP2.push(element);
      // });
      // this.pokemonSPSubject.next(this.pokemonSP);
    });
  }
  // In your component TypeScript file (pokemon-data.component.ts)
// filteredSprites: { [key: string]: string } = {};
private filteredSpritesSubject = new Subject<any[]>();
// pokemonJSON: any;
filteredSprites$: Observable<any> = this.filteredSpritesSubject.asObservable();

ngOnInit(): void {
  this.pokemonData$.subscribe(data => {
    this.filteredSpritesSubject.next(this.getNonNullSprites(data.sprites));
  });
  
}

getNonNullSprites(sprites: { [key: string]: string }): any[] {
  const nonNullSprites: any= [];
  for (const key in sprites) {
    if (sprites[key]&& key.includes('front')) {
      nonNullSprites.push({ "img": sprites[key] , "name": key });
        }
    
  }
  return nonNullSprites;
}
isText(data: unknown): data is string {
  return typeof data === 'string';
};

}
