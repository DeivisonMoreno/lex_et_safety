export interface DatosSubetapas {
    [nombreEtapa: string]: EtapaDetalle;
}

export interface EtapaDetalle {
    ordinal_etapa: number;
    subetapas: Subetapa[];
}

export interface Subetapa {
    subetapa: string;
    ordinal_subetapa: number;
    fecha_marcada: string | null;
    observacion: string | null;
    usuario: string | null;
    fecha_modificacion: string | null;
}

export interface DatosAdicionales {
    clase: string;
    color: string;
    linea: string;
    marca: string;
    placa: string;
    modelo: number;
    cilindraje: number;
    combustible: string;
    numero_motor: string;
    numero_chasis: string;
    tipo_vehiculo: string;
    fecha_matricula: string;
    capacidad_pasajeros: number;
    numero_licencia_tránsito: string;
}


export interface DatosGenerales {
    carpeta: number;
    fecha_recibo: string;
    nombre: string;
    cedula: string;
    capital: number;
    cuantia: string;
    tipo_proceso: string;
    ciudad: string;
    departamento: string;
    juzgado: string;
    clasificacion: string;
    sub_clasificacion: string;
    subetapa_ultimo: string;
}


export interface ProcesoData {
    success: boolean;
    data: {
        datos_generales: DatosGenerales[];
        datos_adicionales: DatosAdicionales;
        datos_subetapas: DatosSubetapas;
    };
}
