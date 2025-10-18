import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { delay } from 'rxjs';
import { ItemService } from '../../services/item.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { API_URL } from 'src/app/services/utils/Constants';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { ɵDomSanitizerImpl } from '@angular/platform-browser';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {
  apiUrl: string = API_URL;
  perfilcomponent: any;
  onImageError(event: Event) {
    // Cambia el src de la imagen a una imagen alternativa en caso de error
    (event.target as HTMLImageElement).src = 'assets/Notfound.png';
  }

  cliente: any;

  items: any[] = [];
  itemsFav: any[] = [];
  groupedItems: { [marca: string]: any[] } = {};
  displayedItems: { [marca: string]: any[] } = {};
  param2: string = '';
  searchExecuted  = false;
  marcas: string[] = [];
  selectedMarca: string = '';
  selectedItem: any = null;
  userCodTercero: string | null = null;
  currentIndex = 0;
  intervalId: any;

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;


  logos:{ [key: string]: string } = {
    'HIKVISION': 'assets/marcas/Hikvision.png',
    'EZVIZ': 'assets/marcas/EZVIZ.png',
    'HILOOK': 'assets/marcas/HILOOK.png',
    // Agrega más marcas y logos según sea necesario
  };

  constructor(private itemService: ItemService, private cartService : CartService, private clienteService: ClienteService, private router: Router) { }

  ngOnInit(): void {


    // Subscríbete al observable para recibir los cambios
    this.itemService.selectedItem$.subscribe((item) => {
      this.selectedItem = item;
    });

    this.clienteService.clienteSeleccionado$.subscribe(c => {
      this.cliente = c;
    });

    if (!this.cliente) {
      this.cliente = this.clienteService.getClienteSeleccionado();
    }

    this.getFavorite(this.cliente.Codigo);

    if (localStorage.getItem('rol') === 'VENDEDOR' && !this.cliente) {
      console.log("Verificando")
      this.router.navigate(['/listClient']);
      Swal.fire({
        title: 'Selecciona un cliente',
        text: 'Debes seleccionar un cliente antes de continuar.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ir al listado de clientes',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/listClient']);
        }
      });
    }

  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  startAutoScroll(): void {
    this.stopAutoScroll(); // evita duplicados
    this.intervalId = setInterval(() => {
      const container = this.carouselContainer?.nativeElement;
      if (!container || this.itemsFav.length === 0) return;

      // Si llegó al final, vuelve al inicio
      if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 220, behavior: 'smooth' }); // Desplaza 220px
      }
    }, 2500); // cada 2.5 segundos
  }

  stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getLogoUrl(marca: string): string {
    return this.logos[marca] || 'assets/logos/default.png'; // Logo por defecto
  }

  onSearch(): void {
    this.searchExecuted = true;

    if (this.param2) {
      this.selectedMarca = '';
      this.fetchItems(this.param2);
      this.onFilterByMarca();

      this.getFavorite(this.cliente.Codigo);

      const filtro = this.param2.toLowerCase();
      this.itemsFav = this.itemsFav.filter(item =>
        item.NombreFull?.toLowerCase().includes(filtro)
      );

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

    this.itemService.getItems(param2, this.cliente.Codigo).subscribe(
      (data) => {
        this.items = data;
        this.groupItemsByMarca();
        this.onFilterByMarca();
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
      this.displayedItems = { ...this.groupedItems };
    }
  }

  selectItem(item: any): void {
    this.selectedItem = item;
  }

  closeDetail(): void {
    this.selectedItem = null;
  }

  perfilComponent!: PerfilComponent;

  addToCart(codProducto: string): void {


    this.userCodTercero = this.cliente.Codigo;
    const item: CartItem = {
      CodTercero: this.userCodTercero,
      CodProducto: codProducto,
      Cantidad: 1,
    };

    this.cartService.addItem(item).subscribe({
      next: () => {
        console.log('Producto agregado al carrito');
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado',
          text: 'El producto se ha agregado al carrito exitosamente.',
          showConfirmButton: false,
          timer: 2000 // Alerta se cierra automáticamente después de 2 segundos
        });
        this.cartService.notifyCartUpdated(); // Actualiza el carrito
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al agregar el producto al carrito. Por favor, intenta nuevamente.',
          footer: `<small>Detalles: ${error.message}</small>`
        });
        console.error('Error al agregar producto al carrito:', error);
      }
    });
  }


  infoprod(pdfUrl : string): void{
    if (!pdfUrl) {
      Swal.fire({
        icon: 'error',
        title: 'No disponible',
        text: 'No hay un DataSheet disponible para este producto.',
      });
      return;
    }

    Swal.fire({
      title: 'Ficha Técnica',
      html: `
        <object data="${pdfUrl}" type="application/pdf" width="100%" height="500px">
          <p>Tu navegador no soporta la visualización de PDF.
             <a href="${pdfUrl}" target="_blank">Haz clic aquí para ver el PDF</a>
          </p>
        </object>
      `,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      width: '80%', // Puedes ajustar el tamaño del modal
      padding: '20px',
      background: '#fff',
    });
  }


  getFavorite(Codigo : string): void {

    console.log(this.cliente);

    this.itemService.getItemsFav(Codigo).subscribe(
      (data) => {
        this.itemsFav = data;

        console.log(this.itemsFav);
        this.groupItemsByMarca();
        this.onFilterByMarca();

        // Generar lista de marcas únicas desde los items
        this.marcas = [...new Set(this.items.map(item => item.Marca))];

        Swal.close();

        // Mostrar alerta si no hay resultados
        if (this.itemsFav.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron productos para el criterio de búsqueda.'
          });
        }
      },
      (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar los productos favoritos.'
        });
        console.error('Error al obtener items favoritos:', error);
      }
    );
    this.startAutoScroll();
  }








}
