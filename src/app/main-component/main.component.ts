import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';

//MATiriAL
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//models
import { Pokemon } from '../models/pokemon';
const url: string = 'https://pokeapi.co/api/v2/pokemon';
const com = `${url}?offset=${0}&limit=${1349}`;

//router
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  

  sorting_state = 0;
  http: HttpClient = inject(HttpClient);
  routes = inject(Router);
  private pokemonListSubject = new Subject<any[]>();
  pokemonJSON: any;
  pokemonList$: Observable<Pokemon[]> = this.pokemonListSubject.asObservable();

  constructor(private router: Router) {
    this.getAllPokemone();
  }

  /////////NOT in use/////////
  getPokemonByPage(offset: number = 0, limit: number = 20) {
    const url: string = 'https://pokeapi.co/api/v2/pokemon';
    const com = `${url}?offset=${offset}&limit=${limit}`;
    this.http.get<any>(com).subscribe(data => {
      this.pokemonListSubject.next(data.results);
    });
  }
  ///////////////END//////////

  getAllPokemone() {
    // const url: string = 'https://pokeapi.co/api/v2/pokemon';
    // const com = `${url}?offset=${0}&limit=${100}`;
    this.http.get<any>(com).subscribe(data => {
      this.pokemonJSON= data.results;
      this.pokemonListSubject.next(data.results);
    });
  }
  
  sort(event: Event) {
    const input = event.target as HTMLInputElement;
    this.sorting_state++;
    
    // this.pokemonList$.forEach((poke) => {

    // this.pokemonListSubject.next([]);
    // }
    if (this.sorting_state % 2 == 0) {
      this.pokemonJSON.sort((a:any, b:any) => a.name.localeCompare(b.name));
    } else {
      this.pokemonJSON.sort((a:any, b:any) => b.name.localeCompare(a.name));
    }
    this.pokemonListSubject.next(this.pokemonJSON);
  }

  filter(event: Event, filterValue: string) {
    const input = event.target as HTMLInputElement;
    
    this.pokemonJSON =this.pokemonJSON.filter((poke: any) => {
      // const val=poke.name.includes(filterValue);
      return poke.name.includes(filterValue);
    });
    this.pokemonListSubject.next(this.pokemonJSON);
  }
  refrashlist(event: Event) {
    const input = event.target as HTMLInputElement;
    this.http.get<any>(com).subscribe(data => {
      this.pokemonJSON= data.results;
      this.pokemonListSubject.next(data.results);
    });
  }
  moredata_route(event: Event, data: string) {
    //route to hero component
    
    //
    const input = event.target as HTMLInputElement;

    this.router.navigate(['/pokemon_data',{data}]);
    //this.routes.navigateByUrl('/hero');
  }

  private paginatedpokemonListSubject = new Subject<any[]>();

  public paginatedPokemonList$: Observable<Pokemon[]> = this.paginatedpokemonListSubject.asObservable();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  
  ngOnInit(): void {
    this.pokemonList$.subscribe(pokemonList => {
      this.totalItems = pokemonList.length;
      this.paginatePokemonList(pokemonList)
    });
  }
  onPageChange(event: PageEvent): void {
    
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginatePokemonList();
  }
  paginatePokemonList(pokemonList?: Pokemon[]): void {
    if (pokemonList) {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedpokemonListSubject.next(pokemonList.slice(startIndex, endIndex));
    }
    else {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedpokemonListSubject.next(this.pokemonJSON.slice(startIndex, endIndex));
  
    }
  }


  // items =[]//this.getData(this.currentPage, this.pageSize); // Fetch data for the current page

  // pageChanged(event: PageEvent) {
  //   this.currentPage = event.pageIndex;
  //   this.items = this.pokemonJSON;
  // }

}
