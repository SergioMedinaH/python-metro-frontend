import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { cn, getLineaColorHEX } from '@/lib/utils';
import { Button } from './ui/button';
import { MarcadorProps, Parada } from '@/types/global';


const OpenLayersMap = ({ paradas, paradaOrigen, paradaDestino, onSelectOrigen, onSelectDestino, trayecto, transbordos }: MarcadorProps) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null); // Popup general (que aparece al pulsar la parada)
    const origenPopupRef = useRef<HTMLDivElement>(null); // Popup para origen
    const destinoPopupRef = useRef<HTMLDivElement>(null); // Popup para destino
    const [olMap, setOlMap] = useState<Map>();
    const [popupData, setPopupData] = useState<Parada | null>(null);

    const center: [number, number] = [-58.391826, -34.608556];

    
    
    // TODO : Poner la carga del mapa fuera del useEffect &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    useEffect(() => {
        // Crear el mapa base
        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://api.maptiler.com/maps/basic-v2-light/{z}/{x}/{y}.png?key=ZUD5ZaSBLjVa2VifcsYh',
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
        
        // Crear los overlays para origen y destino
        const origenOverlay = new Overlay({
            element: origenPopupRef.current!,
            positioning: 'bottom-center',
            stopEvent: true,
            offset: [0, -10]
        });
        map.addOverlay(origenOverlay);

        const destinoOverlay = new Overlay({
            element: destinoPopupRef.current!,
            positioning: 'bottom-center',
            stopEvent: true,
            offset: [0, -10]
        });
        map.addOverlay(destinoOverlay);

        // Función para mostrar los popups de origen y destino
        const showOriginDestinationPopups = () => {
            // Mostrar el popup de origen
            const paradaOrigenData = paradas.find(parada => parada.value === paradaOrigen || '');
            if (paradaOrigenData) {
                const coordinate = fromLonLat([paradaOrigenData.lng, paradaOrigenData.lat]);
                origenOverlay.setPosition(coordinate);
            } else {
                origenOverlay.setPosition(undefined); // Ocultar popup si no hay origen
            }

            // Mostrar el popup de destino
            const paradaDestinoData = paradas.find(parada => parada.value === paradaDestino || '');
            if (paradaDestinoData) {
                const coordinate = fromLonLat([paradaDestinoData.lng, paradaDestinoData.lat]);
                destinoOverlay.setPosition(coordinate);
            } else {
                destinoOverlay.setPosition(undefined); // Ocultar popup si no hay destino
            }
        };

        // Llamar a la función al cargar el mapa y cada vez que cambien origen/destino
        showOriginDestinationPopups();
        if (trayecto.length === 0) {
            // Crear el overlay para el popup general
            const overlay = new Overlay({
                element: popupRef.current!,
                positioning: 'bottom-center',
                stopEvent: true,
                offset: [0, -10]
            });
            map.addOverlay(overlay);
            // Crear capa para las líneas de transbordo
            const transbordoLayer = new VectorLayer({
                source: new VectorSource({
                    features: transbordos.map((transbordo) => {
                        const estaciones = paradas.filter(p => 
                            p.value === transbordo.origen || p.value === transbordo.destino
                        );

                        if (estaciones.length > 1) {
                            const lineCoords = estaciones.map(est => 
                                fromLonLat([est.lng, est.lat])
                            );
                            const lineFeature = new Feature({
                                geometry: new LineString(lineCoords)
                            });

                            lineFeature.setStyle(new Style({
                                stroke: new Stroke({
                                    color: getLineaColorHEX("Transbordo") || 'gray',
                                    width: 5,
                                    lineDash: [5, 10], // Línea discontinua
                                })
                            }));
                            return lineFeature;
                        }
                        return null;
                    }).filter(Boolean) as Feature[], // Filtramos cualquier valor `null` para obtener solo las líneas válidas
                })
            });
            map.addLayer(transbordoLayer);

            // Crear capa de líneas para las paradas según línea
            const lineLayer = new VectorLayer({
                source: new VectorSource({
                    features: ['A', 'B', 'C', 'D', 'E'].flatMap(linea => {
                        const estaciones = paradas.filter(p => p.linea === linea);
                        if (estaciones.length > 1) {
                            const lineCoords = estaciones.map(est => fromLonLat([est.lng, est.lat]));
                            const lineFeature = new Feature({
                                geometry: new LineString(lineCoords)
                            });

                            const color = getLineaColorHEX(linea) || 'gray';
                            lineFeature.setStyle(new Style({
                                stroke: new Stroke({
                                    color,
                                    width: 5,
                                })
                            }));
                            return lineFeature;
                        }
                        return [];
                    }),
                })
            });
            map.addLayer(lineLayer);

            // Crear capa de marcadores para cada parada
            const markersLayer = new VectorLayer({
                source: new VectorSource({
                    features: paradas.map(parada => {
                        const point = new Point(fromLonLat([parada.lng, parada.lat]));
                        const feature = new Feature(point);
                        const color = getLineaColorHEX(parada.linea) || 'gray';
    
                        feature.setProperties({...parada, type: 'parada'}); // Añadir datos de la parada al feature
                        feature.setStyle(new Style({
                            image: new Circle({
                                radius: 5,
                                fill: new Fill({ color }),
                            })
                        }));
                        return feature;
                    }),
                })
            });
            map.addLayer(markersLayer);

            // Mostrar popup cuando se hace clic en un marcador
            map.on('click', (event) => {
                overlay.setPosition(undefined); // Ocultar el popup inicialmente
    
                map.forEachFeatureAtPixel(event.pixel, (feature) => {
                    const featureProperties = feature.getProperties();
                    // Verificar que el tipo del feature sea "parada" antes de mostrar el popup
                    if (featureProperties.type === 'parada' && featureProperties.value !== paradaOrigen && featureProperties.value !== paradaDestino) {
                        const clickedParada = featureProperties as Parada;
                        setPopupData(clickedParada); // Guardar la parada en el estado
                        overlay.setPosition(event.coordinate); // Posicionar el popup sobre la parada
                    }
                    return true; // Detener la iteración después del primer marcador
                });
            });
            let currentFeature: Feature | null = null;
            // Cambiar el cursor a pointer al pasar sobre un marcador de tipo "parada"
            map.on('pointermove', (event) => {
                
                map.getTargetElement().style.cursor = ''; // Restablecer el cursor por defecto
                
                map.forEachFeatureAtPixel(event.pixel, (feature) => {
                    const featureProperties = feature.getProperties();
                    if (featureProperties.type === 'parada') {
                        currentFeature = feature as Feature;
                        map.getTargetElement().style.cursor = 'pointer'; // Cambiar el cursor a pointer
                        const originalStyle = (currentFeature).getStyle();
                        if (originalStyle && originalStyle instanceof Style) {
                            // Cambiar el tamaño del marcador
                            const newStyle = new Style({
                                image: new Circle({
                                    radius: 8,
                                    fill: (originalStyle.getImage() as Circle).getFill() || new Fill({ color: 'gray' })
                                })
                            });
                            (feature as Feature).setStyle(newStyle);
                        }
                        return true; // Detener la iteración después de detectar una parada
                    }
                });
                if(!map.hasFeatureAtPixel(event.pixel)) {
                    if(currentFeature) {
                        const originalStyle = (currentFeature as Feature).getStyle() as Style | null;
                        if (originalStyle && originalStyle instanceof Style) {
                            // Restaurar el tamaño original
                            const resetStyle = new Style({
                                image: new Circle({
                                    radius: 5,
                                    fill: (originalStyle.getImage() as Circle).getFill() || new Fill({ color: 'gray' })
                                })
                            });
                            (currentFeature as Feature).setStyle(resetStyle);
                        }
                    }
                }
            });

            // Cerrar el popup al hacer clic fuera
            map.on('click', (event) => {
                if (!map.hasFeatureAtPixel(event.pixel)) {
                    overlay.setPosition(undefined);
                    setPopupData(null);
                }
            });
        } else {
            console.log(trayecto);
            // Capa para los trayectos cuando trayecto.length !== 0
            const trayectoLayer = new VectorLayer({
                source: new VectorSource({
                    features: trayecto.flatMap((linea, index) => {
                        const estaciones = linea.paradas;
                        const lineColor = getLineaColorHEX(linea.linea) || 'gray';

                        // Crear los marcadores
                        const markerFeatures = estaciones.map(parada => {
                            const point = new Point(fromLonLat([parada.lng, parada.lat]));
                            const feature = new Feature(point);
                            const color = getLineaColorHEX(parada.linea) || 'gray';

                            feature.setStyle(new Style({
                                image: new Circle({
                                    radius: 5,
                                    fill: new Fill({ color }),
                                })
                            }));
                            return feature;
                        });
                        // Crear la línea de trayecto
                        if (estaciones.length > 1) {
                            const lineCoords = estaciones.map(est => fromLonLat([est.lng, est.lat]));
                            const lineFeature = new Feature({
                                geometry: new LineString(lineCoords)
                            });

                            // Estilo discontínuo para "Transbordo"
                            const dashArray = linea.linea === "Transbordo" ? [5, 10] : undefined;
                            lineFeature.setStyle(new Style({
                                stroke: new Stroke({
                                    color: lineColor,
                                    width: 5,
                                    lineDash: dashArray
                                })
                            }));
                            return [lineFeature, ...markerFeatures];
                        }
                        return markerFeatures;
                    }).flat(), // Aplana la lista de características
                })
            });

            map.addLayer(trayectoLayer);
        }

        setOlMap(map);

        return () => map.setTarget(undefined);
    }, [trayecto, paradaOrigen,paradaDestino]);

    {/* Interfaz del mapa */}
    return <div ref={mapDivRef} className='sm:w-full h-full w-0'>
    {/* Popup overlay */}
    <div ref={popupRef} className="bg-white shadow-md rounded-xl p-4">
        {popupData && (
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2 font-bold justify-center'>
                        <div  className={cn(
                          'w-5 h-5 rounded-sm flex text-center items-center justify-center text-white',
                          popupData.linea === 'A' && 'bg-lineaA',
                          popupData.linea === 'B' && 'bg-lineaB',
                          popupData.linea === 'C' && 'bg-lineaC',
                          popupData.linea === 'D' && 'bg-lineaD',
                          popupData.linea === 'E' && 'bg-lineaE',
                          )}>{popupData.linea}</div>
                    <h4 className=''>{popupData.label}</h4>
                </div>
                <div className='flex flex-col gap-4'>
                    <Button onClick={() => onSelectOrigen(popupData.value)}>Seleccionar como Origen</Button>
                    <Button onClick={() => onSelectDestino(popupData.value)}>Seleccionar como Destino</Button>
                </div>
            </div>
        )}
    </div>
    {/* Popup de origen overlay */}
    {paradaOrigen !== '' &&
        <div ref={origenPopupRef} className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-center text-center gap-2">
            <div className='flex items-center gap-2 font-bold justify-center'>
                <p>Ir desde</p>
                <div  className={cn(
                    'w-5 h-5 rounded-sm flex text-center items-center justify-center text-white',
                    paradas.find(p => p.value === paradaOrigen)?.linea === 'A' && 'bg-lineaA',
                    paradas.find(p => p.value === paradaOrigen)?.linea === 'B' && 'bg-lineaB',
                    paradas.find(p => p.value === paradaOrigen)?.linea === 'C' && 'bg-lineaC',
                    paradas.find(p => p.value === paradaOrigen)?.linea === 'D' && 'bg-lineaD',
                    paradas.find(p => p.value === paradaOrigen)?.linea === 'E' && 'bg-lineaE',
                    )}>{paradas.find(p => p.value === paradaOrigen)?.linea}</div>
                <h4 className=''>{paradas.find(p => p.value === paradaOrigen)?.label}</h4>
            </div>
            
        </div>
    }
    
    {/* Popup de destino overlay */}
    {paradaDestino !== '' &&
    <div ref={destinoPopupRef} className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-center text-center gap-2">
        <div className='flex items-center gap-2 font-bold justify-center'>
            <p>Hasta</p>
            <div  className={cn(
                'w-5 h-5 rounded-sm flex text-center items-center justify-center text-white',
                paradas.find(p => p.value === paradaDestino)?.linea === 'A' && 'bg-lineaA',
                paradas.find(p => p.value === paradaDestino)?.linea === 'B' && 'bg-lineaB',
                paradas.find(p => p.value === paradaDestino)?.linea === 'C' && 'bg-lineaC',
                paradas.find(p => p.value === paradaDestino)?.linea === 'D' && 'bg-lineaD',
                paradas.find(p => p.value === paradaDestino)?.linea === 'E' && 'bg-lineaE',
                )}>{paradas.find(p => p.value === paradaDestino)?.linea}</div>
            <h4 className=''>{paradas.find(p => p.value === paradaDestino)?.label}</h4>
        </div>
    </div>
    }
</div>;
};

export default OpenLayersMap;
