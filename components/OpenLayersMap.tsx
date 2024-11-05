import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

const OpenLayersMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const [olMap, setOlMap] = useState<Map>();

    const center: [number, number] = [-34.608556, -58.391826];

    useEffect(() =>{
        const map = new Map({
             target: mapDivRef.current as HTMLDivElement,
             layers: [
                new TileLayer({
                    source: new XYZ({
                      url: 'https://api.maptiler.com/maps/basic-v2-light/{z}/{x}/{y}.png?key=ZUD5ZaSBLjVa2VifcsYh',
                    })
                  }),
            ],
             view: new View({
                center: fromLonLat(center.reverse()),
                zoom: 15,
                minZoom: 14,
                maxZoom: 18

             })
        });
        setOlMap(map);

        return() => map.setTarget(undefined);
    }, [])

    return <div ref={mapDivRef} className='w-0 sm:w-full h-full'/>
};

export default OpenLayersMap;