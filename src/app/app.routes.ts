import { Routes } from '@angular/router';
import { MainComponent } from './main-component/main.component';
import {PokemonDataComponent} from './pokemon-data/pokemon-data.component';

export const routes: Routes = [
    
    { path: 'pokemon_data',component: PokemonDataComponent , pathMatch:'prefix'},
    { path: 'main', component: MainComponent },
    //wildcard route
    { path: '**', component: MainComponent }
];

//add the following routs for pages:
//  •MAIN On page-load, show a list of all Pokémon names
// 	•	Make the list sortable by name (ascending & descending)
// 	•	Add the ability to search/filter the results by name
// 	•	On a Pokémon name click, display a new page with details about that specific Pokémon – must be a separate route.

