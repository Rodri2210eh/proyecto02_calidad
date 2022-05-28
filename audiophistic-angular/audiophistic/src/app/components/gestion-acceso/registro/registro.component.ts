import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AccesoService } from 'src/app/services/gestion-acceso/acceso.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['../compartir-form.css', './registro.component.css']
})
export class RegistroComponent implements OnInit {
  // Declaracion de las variables para comprobar la seguridad de una contraseña
  numeros = "0123456789";
  letras="abcdefghyjklmnñopqrstuvwxyz";
  letras_mayusculas="ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";
  
  registro_form: FormGroup = {} as FormGroup;
  enviado: Boolean = false;

  constructor(private formBuilder: FormBuilder, private acceso_service: AccesoService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.registro_form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  get form() { return this.registro_form.controls }

  registrarse() {
    let registro_info = this.registro_form.getRawValue();

    this.enviado = true;

    if (this.registro_form.invalid) { return; }

    this.acceso_service.registrarse(registro_info).subscribe(
      (res: any) => {
        this.toastr.clear();
        if (res.body.error) {
          this.toastr.error(res.body.error, 'Error', { timeOut: 5000 });
        } else {
          this.toastr.success(`Bienvenido`, 'Se envió un correo para activar su cuenta', { timeOut: 2000 });
        }
      }, (error) => {
        this.toastr.error("Hubo un error al conectarse al sistema", 'Error', { timeOut: 5000 });
      }
    );

    this.enviado = false;
  }

  tiene_numeros(texto: string){
    for(let i=0; i<texto.length; i++){
      if (this.numeros.indexOf(texto.charAt(i),0)!=-1){
            return 1;
      }
    }
    return 0;
  }

tiene_letras(texto:string){
  texto = texto.toLowerCase();
  for(let i=0; i<texto.length; i++){
      if (this.letras.indexOf(texto.charAt(i),0)!=-1){
        return 1;
      }
  }
  return 0;
}

tiene_minusculas(texto: string){
  for(let i=0; i<texto.length; i++){
      if (this.letras.indexOf(texto.charAt(i),0)!=-1){
        return 1;
      }
  }
  return 0;
}

tiene_mayusculas(texto: string){
  for(let i=0; i<texto.length; i++){
    if (this.letras_mayusculas.indexOf(texto.charAt(i),0)!=-1){
      return 1;
    }
  }
  return 0;
}

  seguridad_clave(clave: string){
    var seguridad = 0;
    if (clave.length!=0){
      if (this.tiene_numeros(clave) && this.tiene_letras(clave)){
          seguridad += 30;
      }
      if (this.tiene_minusculas(clave) && this.tiene_mayusculas(clave)){
          seguridad += 30;
      }
      if (clave.length >= 4 && clave.length <= 5){
          seguridad += 10;
      }else{
          if (clave.length >= 6 && clave.length <= 8){
          seguridad += 30;
          }else{
          if (clave.length > 8){
              seguridad += 40;
          }
        }
      }
    }
    return seguridad            
  }

  muestra_seguridad_clave(clave: string,formulario: { seguridad: { value: string; }; }){
    var seguridad = this.seguridad_clave(clave);
    formulario.seguridad.value=seguridad + "%";
  }

}
