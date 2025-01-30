export class Alumno {
    constructor(
        public nombre: string,
        public apellidos: string,
        public dni: string,
        public fecha: Date,
        public poblacion: string,
        public telefono: number,
        public curso: number, 
        public modulos: Array<string>){}
  }