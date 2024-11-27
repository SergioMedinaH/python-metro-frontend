export interface Parada {
    value: string;
    label: string;
    lat: number;
    lng: number;
    linea: string;
    frecuencia: number;
}
export interface Transbordo {
    origen: string;
    destino: string;
}
export interface ApiResponse {
    trayectos: Trayecto[];
    ruta: string[];
    tiempos: number[];
    duracionTotal: number;
    horaLlegada: string;
}

export interface Trayecto {
    linea: string;
    paradas: Parada[];
    tiempos: number[];

    horaSalida: string;
    horaFin: string;

    tiempoEspera: number;
    tiempoEsperaSalida: number;
    


}
export interface MarcadorProps {
    paradas: { value: string; label: string, lat: number, lng: number, linea: string }[],
    paradaOrigen: string,
    paradaDestino: string,
    onSelectOrigen: (value: string) => void,
    onSelectDestino: (value: string) => void,
    trayecto: Trayecto[],
    transbordos: Transbordo[]
}