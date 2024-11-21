export interface Parada {
    value: string;
    label: string;
    lat: number;
    lng: number;
    linea: string;
}
export interface Transbordo {
    origen: string;
    destino: string;
}
export interface ApiResponse {
    ruta: string[];
    tiempos: number[];
}

export interface Trayecto {
    linea: string;
    paradas: Parada[];
    tiempos: number[];
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