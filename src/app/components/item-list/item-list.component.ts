import { Component } from '@angular/core';
import { delay } from 'rxjs';
import { ItemService } from '../../services/item.service';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {

  onImageError(event: Event) {
    // Cambia el src de la imagen a una imagen alternativa en caso de error
    (event.target as HTMLImageElement).src = 'assets/Notfound.png';
  }

  items: any[] = [];
   param2: string = '';
  searchExecuted  = false;

  constructor(private itemService: ItemService) { }

  onSearch(): void {
    this.searchExecuted = true;
    if (this.param2) {
      this.fetchItems(this.param2);
    } else {
      console.warn('Ambos campos deben estar llenos para realizar la búsqueda');
    }
  }

  private fetchItems(param2: string): void {
    this.itemService.getItems(param2).pipe(delay(1000)).subscribe(
      (data) => {
        this.items = data;
      },
      (error) => {
        console.error('Error al obtener los items', error);
      }
    );

  }

}
