import { Component } from '@angular/core';
import { delay } from 'rxjs';
import { ItemService } from '../../services/item.service';
import Swal from 'sweetalert2';


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
  groupedItems: { [marca: string]: any[] } = {};
  displayedItems: { [marca: string]: any[] } = {};
  param2: string = '';
  searchExecuted  = false;
  marcas: string[] = [];
  selectedMarca: string = '';

  constructor(private itemService: ItemService) { }

  onSearch(): void {
    this.searchExecuted = true;

    if (this.param2) {
      this.fetchItems(this.param2);
      this.onFilterByMarca();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Debes ingresar el nombre o referencia del producto para buscar.'
      });
      console.warn('Ambos campos deben estar llenos para realizar la búsqueda');

    }
  }

  private fetchItems(param2: string): void {

    let timerInterval: any;


    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor, espera mientras obtenemos los datos.',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (timer) {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });

    this.itemService.getItems(param2).subscribe(
      (data) => {
        this.items = data;
        this.groupItemsByMarca();
        this.marcas = [...new Set(this.items.map(item => item.Marca))];
        Swal.close();
        if (this.items.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron productos para el criterio de búsqueda.'
          });
        }

      },
      (error) => {
        console.error('Error al obtener los items', error);
        Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al obtener los datos. Inténtalo de nuevo más tarde.'
        });

      }
    );

  }

  private groupItemsByMarca(): void {
    this.groupedItems = this.items.reduce((groups, item) => {
      const marca = item.Marca;
      if (!groups[marca]) {
        groups[marca] = [];
      }
      groups[marca].push(item);
      return groups;
    }, {});
  }

  onFilterByMarca(): void {
    if (this.selectedMarca) {
      this.displayedItems = {
        [this.selectedMarca]: this.groupedItems[this.selectedMarca] || []
      };
    } else {
      this.displayedItems = { ...this.groupedItems }; // Mostrar todas las marcas si no se selecciona ninguna
    }
  }

}
