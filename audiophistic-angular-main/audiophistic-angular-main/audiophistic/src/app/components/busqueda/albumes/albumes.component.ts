import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/Productos/producto';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { cantidad_a_traer_global, opciones_slider_global } from 'src/app/models/global';
import { BusquedasService } from 'src/app/services/busquedas/busquedas.service';

@Component({
  selector: 'app-albumes',
  templateUrl: './albumes.component.html',
  styleUrls: ['../compartir.css', './albumes.component.css']
})
export class AlbumesComponent implements OnInit {

  productos: Producto[] = []
  presentaciones: any[] = []
  generos: any[] = []
  termino: string = ''
  cantidad_a_traer: number = cantidad_a_traer_global;
  pagina: number = -(cantidad_a_traer_global - 1);
  loading:boolean;

  min_precio: number = 0;
  max_precio: number = 0;
  opciones_slider: Options = opciones_slider_global;
  cargando_comentarios: boolean = false;
  cargar_mas: boolean = false;

  constructor(private productos_service: ProductosService, private toastr: ToastrService,
    private busquedas_service: BusquedasService) {
      this.loading = false;
     }

  ngOnInit(): void {
    this.consultar_albumes();
    this.consultar_filtro_presentaciones();
    this.consultar_filtro_generos();
    this.consultar_filtro_precios();
  }

  consultar_albumes() {
    this.loading = true;
    this.productos_service.consultar_productos_por_tipo(1).subscribe(
      (res: any) => {
        this.toastr.clear();
        if (res.body.error) {
          this.toastr.error(res.body.error, 'Error', { timeOut: 5000 });
        } else {
          this.productos = res.body.resultado;
        }
        this.loading = false;
      }, (error) => {
        this.toastr.error("Hubo un error al conectarse al sistema", 'Error', { timeOut: 5000 });
      }
    )
  }

  consultar_filtro_presentaciones() {
    this.loading = true;
    this.busquedas_service.consultar_presentaciones_albumes().subscribe(
      (res: any) => {
        this.toastr.clear();
        if (res.body.error) {
          this.toastr.error(res.body.error, 'Error', { timeOut: 5000 });
        } else {
          this.presentaciones = res.body.resultado;
        }
        this.loading = false;
      }, (error) => {
        this.toastr.error("Hubo un error al conectarse al sistema", 'Error', { timeOut: 5000 });
      }
    )
  }

  consultar_filtro_generos() {
    this.loading = true;
    this.busquedas_service.consultar_generos_albumes().subscribe(
      (res: any) => {
        this.toastr.clear();
        if (res.body.error) {
          this.toastr.error(res.body.error, 'Error', { timeOut: 5000 });
        } else {
          this.generos = res.body.resultado;
        }
        this.loading = false;
      }, (error) => {
        this.toastr.error("Hubo un error al conectarse al sistema", 'Error', { timeOut: 5000 });
      }
    )
  }

  consultar_filtro_precios() {
    this.busquedas_service.consultar_precios_albumes().subscribe(
      (res: any) => {
        this.toastr.clear();
        if (res.body.error) {
          this.toastr.error(res.body.error, 'Error', { timeOut: 5000 });
        } else {
          let precios = res.body.resultado;
          this.min_precio = precios.limite_min;
          this.max_precio = precios.limite_max;
          this.opciones_slider = this.crear_slider();
        }
      }, (error) => {
        this.toastr.error("Hubo un error al conectarse al sistema", 'Error', { timeOut: 5000 });
      }
    )
  }

  crear_slider() {
    return {
      floor: this.min_precio,
      ceil: this.max_precio,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>Mín.:</b> ₡' + value;
          case LabelType.High:
            return '<b>Máx.:</b> ₡' + value;
          default:
            return '₡' + value;
        }
      }
    }
  }

  buscar() {
    this.pagina = -(this.cantidad_a_traer - 1);
    this.productos = []
    this.cargar_mas_productos();
  }

  cargar_mas_productos() {
    this.cargando_comentarios = true;
    
    let presentacion = (document.querySelector('input[name="presentaciones_filtro"]:checked') as any)!.value;
    presentacion == "sin_filtro" ? presentacion = null : null;
    let genero = (document.querySelector('input[name="generos_filtro"]:checked') as any)!.value;
    genero == "sin_filtro" ? genero = null : null;
    let busqueda_info = {
      titulo: this.termino,
      presentacion: presentacion,
      genero: genero,
      precio_min: this.min_precio,
      precio_max: this.max_precio,
      cantidad_a_buscar: this.cantidad_a_traer,
      pagina: this.pagina + this.cantidad_a_traer
    }
    this.loading = true;
    this.busquedas_service.buscar_albumes(busqueda_info).subscribe(
      (res: any) => {
        this.toastr.clear();
        if (res.body.error) {
          this.toastr.error(res.body.error, 'Error', { timeOut: 5000 });
        } else {
          if (res.body.resultado.cantidad_total == 0) {
            this.toastr.warning('No hay resultados para esta búsqueda', 'Sin resultados', { timeOut: 5000 });
            return;
          }
          this.pagina += this.cantidad_a_traer;
          this.productos = this.productos.concat(res.body.resultado.productos)
          this.productos.length < res.body.resultado.cantidad_total ? this.cargar_mas = true : this.cargar_mas = false;
          this.cargando_comentarios = false;
        }
        this.loading = false;
      }, (error) => {
        this.toastr.error("Hubo un error al conectarse al sistema", 'Error', { timeOut: 5000 });
      }
    )
  }

}
