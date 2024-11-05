import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { getLineaColorHEX } from '@/lib/utils';

interface MarcadorProps {
    paradas: { value: string; label: string, lat: number, lng: number, linea: string }[],
    onSelectOrigen: (value: string) => void,
    onSelectDestino: (value: string) => void,
    trayecto: Trayecto[],
    transbordos: Transbordo[]
}
interface Parada {
  value: string;
  label: string;
  lat: number;
  lng: number;
  linea: string;
}
interface Trayecto {
  linea: string;
  paradas: Parada[];
  tiempos: number[];
}
interface Transbordo {
  origen: string;
  destino: string;
}

const OpenLayersMap = ({paradas, onSelectOrigen,onSelectDestino, trayecto, transbordos}: MarcadorProps) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const [olMap, setOlMap] = useState<Map>();

    // Coordenadas en formato [longitud, latitud]
    const center: [number, number] = [-58.391826, -34.608556]; // Asegúrate de que estas coordenadas son correctas

    useEffect(() => {
        // Crear el mapa
        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://api.maptiler.com/maps/basic-v2-light/{z}/{x}/{y}.png?key=ZUD5ZaSBLjVa2VifcsYh',
                    })
                }),
                // Capa para los marcadores
                new VectorLayer({
                    source: new VectorSource({
                        features: paradas.map(parada => {
                            // Crear un marcador en la posición de la parada
                            const point = new Point(fromLonLat([parada.lng, parada.lat]));
                            const feature = new Feature(point);
                            
                            // Establecer el color del marcador según la línea
                            const color = getLineaColorHEX(parada.linea) || 'gray'; // Color por defecto si no se encuentra

                            // Establecer el estilo del marcador
                            feature.setStyle(new Style({
                                image: new Circle({
                                    radius: 5, // Radio del círculo
                                    fill: new Fill({ color }), // Color de relleno según la línea
                                    stroke: new Stroke({
                                        color: 'black', // Color del borde
                                        width: 1 // Grosor del borde
                                    })
                                })
                            }));

                            return feature;
                        }),
                    })
                })
            ],
            view: new View({
                center: fromLonLat(center),
                zoom: 15,
                minZoom: 14,
                maxZoom: 18
            })
        });

        setOlMap(map);

        return () => map.setTarget(undefined);
    }, []);

    return <div ref={mapDivRef} className='w-0 sm:w-full h-full'/>;
};

export default OpenLayersMap;
