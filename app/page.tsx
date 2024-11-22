"use client";

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DatePickerWithPresets } from '@/components/datePicker';
import TimeInput from '@/components/timeInput';
import TrayectoComponente from '@/components/trayecto';
import OpenLayersMap from '@/components/OpenLayersMap';
import SwitchPrioridad from '@/components/switchPrioridad';
import { ApiResponse, Parada, Transbordo, Trayecto } from '@/types/global';
import { Button } from '@/components/ui/button';
import { Buscador } from '@/components/ui/buscador';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Accessibility, ChevronRight, LoaderCircle, X } from 'lucide-react';
import Papa from 'papaparse';

export default function Home() {
  const [paradas, setParadas] = useState<Parada[]>([]); // Estado tipado para las paradas

  useEffect(() => {
    const cargarCSV = async () => {
      try {
        // Acceder al archivo CSV en la carpeta public
        const response = await fetch('/paradas.csv'); // Ruta relativa desde la raíz del proyecto
        const csvData = await response.text(); // Obtén el texto del CSV

        // Parsear el CSV usando papaparse
        Papa.parse<Parada>(csvData, {
          header: true, // Si el CSV tiene encabezados
          skipEmptyLines: true, // Ignorar líneas vacías
          complete: (result) => {
            setParadas(result.data); // Guardar los datos en el estado
          },
        });
      } catch (error) {
        console.error('Error al cargar el CSV:', error);
      }
    };

    cargarCSV();
  }, []);
  
  const transbordos: Transbordo[] = [
    {origen: "independencia", destino: "independenciae"},
    {origen: "peru", destino: "bolivar"},
    {origen: "peru", destino: "catedral"},
    {origen: "lima", destino: "avdemayo"},
    {origen: "diagonal", destino: "9dejulio"},
    {origen: "9dejulio", destino: "carlospellegrini"},
    {origen: "retiroc", destino: "retiroe"},
  ];

  // Función para obtener la lista de paradas a partir de una lista de valores, conservando el orden original
  function getOrderedParadas(values: string[]): Parada[] {
    return values.map(value => paradas.find(parada => parada.value === value)!).filter(parada => parada !== undefined);
  }

  // variable del valor de la parada de origen
  const [paradaOrigen, setParadaOrigen] = useState('')
  // función para cambiar la parada de origen
  const handleSelectParadaOrigen = (value: string) => {
    if (paradaOrigen !== value) setParadaOrigen(value);
    
  }
  // variable del valor de la parada de destino
  const [paradaDestino, setParadaDestino] = useState('')
  // función para cambiar la parada de destino
  const handleSelectParadaDestino = (value: string) => {
    if (paradaDestino !== value) setParadaDestino(value);
  }

  // variable que almacena la ruta devuelta por la API
  const [resultado, setResultado] = useState<ApiResponse>();
  // variable que almacena si se está buscando la ruta
  const [loading, setLoading] = useState(false);
  
  // función que calcula la ruta (llama a la API)
  const CalcularRuta = async () => {
    setLoading(true);
    try {
      // Construir la URL con los parámetros de la solicitud GET
      const url = `https://python-metro-api.vercel.app/api?paradaOrigen=${encodeURIComponent(paradaOrigen)}&paradaDestino=${encodeURIComponent(paradaDestino)}`;

      // Realizar la solicitud GET a la API
      const response = await fetch(url);

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('Error en la solicitud a la API');
      }

      // Parsear la respuesta como JSON
      const data: ApiResponse = await response.json();
      setResultado(data);
      
    } catch (error) {
      // Manejar errores en la solicitud
      console.error("Error fetching route:", error);
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  let paradasRuta: Parada[] = [];
  let trayectos: Trayecto[] = [];

  const [trayectosState, setTrayectosState] = useState<Trayecto[]>([]);

  // función que obtiene los trayectos si se actualiza el resultado
  useEffect(() => {
    setTrayectosState([]);
    if (resultado) {
      paradasRuta = getOrderedParadas(resultado.ruta);
      if (paradasRuta && paradasRuta.length > 0) {
        trayectos = [];
        let trayectoActual: Trayecto = { linea: paradasRuta[0].linea, paradas: [paradasRuta[0]], tiempos: [] };

        paradasRuta.forEach((parada,index) => {
          if (index === 0) return;

          const paradaAnterior = paradasRuta[index - 1];

          if (parada.linea === paradaAnterior.linea){
            trayectoActual.paradas.push(parada);
            trayectoActual.tiempos.push(resultado.tiempos[index - 1]);
          }
          else {
            trayectos.push(trayectoActual);
            trayectos.push({ linea: "Transbordo", paradas: [paradaAnterior, parada], tiempos: [resultado.tiempos[index - 1]] });
            trayectoActual = { linea: parada.linea, paradas: [parada], tiempos: [] };
          }
        });
        trayectos.push(trayectoActual);
      }
    } else {
      paradasRuta = [];
      trayectos = [];
    }
    setTrayectosState(trayectos);
  }, [resultado]);

  // función que limpia la ruta,trayectos y resultado si se actualiza la parada de origen o destino
  useEffect(() => {
    paradasRuta = [];
    trayectos = [];
    setTrayectosState([]);
    setResultado(undefined);
  }, [paradaOrigen, paradaDestino]);

  // código de la interfaz
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Panel de la izquierda */}
      <div className="w-full bg-white p-4 overflow-y-auto drop-shadow-md sm:w-[380px] sm:min-w-[380px]">
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4 items-center'>
            <Image className='w-10 h-10 rounded-full' src="https://yt3.googleusercontent.com/ytc/AIdro_kAiJ6bQM7QGSoIQNklbeEYEUBMgLWsZHxBo4K2RTLTrII=s900-c-k-c0x00ffffff-no-rj" width={200} height={200} alt="Icono Metro"/>
            <h1 className='text-xl my-3'>Subte Buenos Aires</h1>               
          </div>
          <h2 className=''>Seleccione su ruta aquí o en el mapa:</h2>
          <Buscador 
            paradas={paradas} 
            texto='Elige un Origen'
            onSelect={handleSelectParadaOrigen}
            selectedValue={paradaOrigen} 
          />
          <Buscador
            paradas={paradas} 
            texto='Elige un Destino' 
            onSelect={handleSelectParadaDestino}
            selectedValue={paradaDestino}
          />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className='text-sm'>Más opciones</AccordionTrigger>
              <AccordionContent className='flex flex-col gap-4 mt-2'>
                <TimeInput/>
                <DatePickerWithPresets/>
                
                <div className='flex gap-2 items-center'>
                  <Switch/>
                  <p className='text-sm flex items-center gap-1'> <Accessibility className='w-5 h-5 bg-blue-500 rounded-sm p-0.5 text-white' /> Solo paradas accesibles </p>
                </div>
                <SwitchPrioridad/>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button onClick={CalcularRuta} disabled={paradaOrigen == "" || paradaDestino == "" || paradaOrigen === paradaDestino}>
            {loading ? <span className='flex gap-2'><LoaderCircle className='w-5 h-5 animate-spin'/> Buscando la mejor ruta...</span> : 'Buscar Ruta'}
          </Button>
          {/* Resultado de la ruta */}
          {resultado &&
          <div className=' flex flex-col gap-4'>
            <div className='mt-4'>
              <div className='flex gap-4'>
                <span className='font-bold text-lg'>{resultado.tiempos.reduce((acumulador, tiempo) => acumulador + tiempo, 0)} min{resultado.tiempos.reduce((acumulador, tiempo) => acumulador + tiempo, 0) > 1 && "s"}</span>
                <div className='font-bold text-lg flex items-center justify-center'>
                  {trayectosState.map((trayecto, index) => {
                    if (trayecto.linea === "Transbordo") {
                      return (
                        <ChevronRight className='w-5 h-5' key={index}/>
                      )
                    }else{
                      return (
                        <div key={index} className='flex gap-1'>
                          <Image className='w-5 h-5 rounded-full' src="https://yt3.googleusercontent.com/ytc/AIdro_kAiJ6bQM7QGSoIQNklbeEYEUBMgLWsZHxBo4K2RTLTrII=s900-c-k-c0x00ffffff-no-rj" width={100} height={100} alt="Icono Metro"/>
                          <div  className={cn(
                          'w-5 h-5 rounded-sm flex text-center items-center justify-center text-white',
                          trayecto.linea === 'A' && 'bg-lineaA',
                          trayecto.linea === 'B' && 'bg-lineaB',
                          trayecto.linea === 'C' && 'bg-lineaC',
                          trayecto.linea === 'D' && 'bg-lineaD',
                          trayecto.linea === 'E' && 'bg-lineaE',
                          )}>{trayecto.linea}</div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
              <div className='flex gap-1'>
                <p className='text-sm'>{resultado.ruta.length} parada{resultado.ruta.length > 1 && "s"}.</p>
                <p className='text-sm'>{trayectosState.filter(trayecto => trayecto.linea === "Transbordo").length} transbordo{trayectosState.filter(trayecto => trayecto.linea === "Transbordo").length > 1 && "s"}.</p>
              </div>
            </div>
            <div className='flex flex-col border-t'>
              {trayectosState.map((trayecto, index) => (
                <TrayectoComponente trayecto={trayecto} key={index}/>
              ))}
            </div>
          </div>
          }
        </div>
      </div>
      {/* Mapa de la derecha */}
      {paradas.length > 0 ?
      <OpenLayersMap paradas={paradas} paradaOrigen={paradaOrigen} paradaDestino={paradaDestino} onSelectOrigen={handleSelectParadaOrigen} onSelectDestino={handleSelectParadaDestino} trayecto={trayectosState} transbordos={transbordos}/>
      : <div className='flex items-center justify-center w-full h-full'>
          <p className='text-sm flex gap-2 items-center'><LoaderCircle className='w-5 h-5 animate-spin'/> Cargando mapa... </p>
        </div>
      }
      </div>
    
  )
}
