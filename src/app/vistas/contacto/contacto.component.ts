import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit {
  contactoForm: FormGroup;
  public enviado: boolean = false;
  //Los datos del proveedor de mensajeria que estoy usando emailjs
  emailJsServiceId = 'service_51sqv6y';
  emailJsTemplateId = 'template_5d7hjdm';
  emailJsUserId = 'HKDqLYgK-D8FBTkAW';

  constructor(public fb: FormBuilder) {
    this.contactoForm = this.fb.group({
      nombre: new FormControl ('', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z ]+$')]),
      email: new FormControl ('', [Validators.required, Validators.email]),
      asunto: new FormControl ('', [Validators.required, Validators.minLength(5)]),
      mensaje: new FormControl ('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
      libroFavorito: new FormControl ('', [Validators.required, Validators.minLength(3)])
    });
  }

  ngOnInit() {}

  enviarFormulario() {
    if (this.contactoForm.valid) {
      const templateParams = {
        from_name: this.contactoForm.value.nombre,
        from_email: this.contactoForm.value.email,
        subject: this.contactoForm.value.asunto,
        message: this.contactoForm.value.mensaje,
        libro_favorito: this.contactoForm.value.libroFavorito
      };

      emailjs.send(this.emailJsServiceId, this.emailJsTemplateId, templateParams, this.emailJsUserId)
        .then(() => {
          console.log("Correo enviado correctamente");
          console.log("Enviando datos:", templateParams);
          this.enviado = true;
          this.contactoForm.reset();
        })
        .catch((error) => {
          console.error("Error al enviar el correo:", error);
        });
    } else {
      console.warn("El formulario no es válido.");
      this.contactoForm.markAllAsTouched();
    }
  }
}
