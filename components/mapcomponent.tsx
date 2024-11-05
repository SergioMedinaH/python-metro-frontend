'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, Marker, Popup , Polyline, Tooltip} from 'react-leaflet';
import L from 'leaflet';
import { Marcador } from '@/components/marcador';
import { getLineaColorHEX } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

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

const MapComponent = ({paradas, onSelectOrigen,onSelectDestino, trayecto, transbordos}: MarcadorProps) => {
    const center: [number, number] = [-34.608556, -58.391826];
    // Definir el radio en grados (aproximado a 100 km)
    const kmToDegrees = (km: number): number => km / 111; // Aproximadamente 111 km por grado de latitud

    // Definir el radio en kilómetros
    const radiusInKm = 10;

    // Convertir el radio a grados
    const radiusInDegrees = kmToDegrees(radiusInKm);

    const bounds = {
    northEast: [center[0] + radiusInDegrees, center[1] + radiusInDegrees],
    southWest: [center[0] - radiusInDegrees, center[1] - radiusInDegrees],    
    };
    console.log("Hola")
    return (
      <MapContainer></MapContainer>
    )
    {/*
        <MapContainer 
        center={center} 
        zoom={15} 
        minZoom={14} 
        maxZoom={18}
        //maxBounds={bounds}       // Limita el área desplazable
        //maxBoundsViscosity={1.0} // Para mantener la cámara dentro de los límites
        className="flex-1"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Estilo CartoDB Positron
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {trayecto.length === 0 && paradas && paradas.map((parada) => (
          <Marcador
            key={parada.value}
            lat={parada.lat}
            lng={parada.lng}
            value={parada.value}
            label={parada.label}
            linea={parada.linea}
            onSelectOrigen={onSelectOrigen}
            onSelectDestino={onSelectDestino}
          />  
        ))}
        
        {trayecto.length === 0 && ['A', 'B', 'C', 'D', 'E'].map((linea) => {
                const estaciones = paradas.filter(p => p.linea === linea);
                if (estaciones.length > 1) {
                    const latLngs = estaciones.map(p => L.latLng(p.lat, p.lng));
                    const color = getLineaColorHEX(linea);
                    return <Polyline key={linea} positions={latLngs} color={color} weight={5} opacity={1} />;
                }
                return null; // Retornar null si no hay estaciones para esa línea
            })}
        
        {trayecto.length === 0 && paradas && transbordos.map((transbordo, index) => {
                const estaciones = paradas.filter(p => p.value === transbordo.origen || p.value === transbordo.destino);
                if (estaciones.length > 1) {
                    const latLngs = estaciones.map(p => L.latLng(p.lat, p.lng));
                    const color = getLineaColorHEX("Transbordo");
                    return <Polyline key={index} positions={latLngs} color={color} weight={5} opacity={1} dashArray={[5,10]}/>;
                }
                return null; // Retornar null si no hay estaciones para esa línea
            })}


        
        {trayecto.length !== 0 && paradas && trayecto.map((linea, index) => {
          const estaciones = linea.paradas;
          const color = getLineaColorHEX(linea.linea);
          return (
            <React.Fragment key={index}>
              {estaciones.map((parada) => (
                <Marcador
                  key={parada.value}
                  lat={parada.lat}
                  lng={parada.lng}
                  value={parada.value}
                  label={parada.label}
                  linea={parada.linea}
                  onSelectOrigen={onSelectOrigen}
                  onSelectDestino={onSelectDestino}
                />  
              ))}
              {estaciones.length > 1 && (
                <Polyline positions={estaciones.map(p => L.latLng(p.lat, p.lng))} color={color} weight={5} opacity={1}dashArray={linea.linea === "Transbordo" ? [5,10] : "undefined" } />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
      */}
}
export default MapComponent;