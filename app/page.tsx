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

export default function Home() {
  const paradas: Parada[] = [
    // Línea A
    { value: "alberti", label: "Alberti", lat: -34.6098887, lng: -58.4008674, linea: "A" },
    { value: "pasco", label: "Pasco", lat: -34.6095527, lng: -58.3983828, linea: "A" },
    { value: "congreso", label: "Congreso", lat: -34.6092415, lng: -58.3926706, linea: "A" },
    { value: "saenzpena", label: "Sáenz Peña", lat: -34.6094200, lng: -58.3866700, linea: "A" },
    { value: "lima", label: "Lima", lat: -34.6091054, lng: -58.3825208, linea: "A" },
    { value: "piedras", label: "Piedras", lat: -34.6092446, lng: -58.3784204, linea: "A" },
    { value: "peru", label: "Perú", lat: -34.6085633, lng: -58.3744662, linea: "A" },
    { value: "plzmayo", label: "Plaza de Mayo Casa Rosada", lat: -34.6086997, lng: -58.3714911, linea: "A" },

    // Línea B
    { value: "pasteur", label: "Pasteur AMIA", lat: -34.6054673, lng: -58.4031439, linea: "B" },
    { value: "callaomaestro", label: "Callao Maestro A. Bravo", lat: -34.6045542, lng: -58.3931682, linea: "B" },
    { value: "uruguay", label: "Uruguay", lat: -34.6051435, lng: -58.3889597, linea: "B" },
    { value: "carlospellegrini", label: "Carlos Pellegrini", lat: -34.6034877, lng: -58.3807319, linea: "B" },
    { value: "florida", label: "Florida", lat: -34.6033000, lng: -58.3745300, linea: "B" },
    { value: "leandro", label: "Leandro N. Alem", lat: -34.6030011, lng: -58.3706754, linea: "B" },

    // Línea C
    { value: "constitucion", label: "Constitución", lat: -34.6275021, lng: -58.3824531, linea: "C" },
    { value: "sanjuan", label: "San Juan", lat: -34.6242829, lng: -58.3874077, linea: "C" },
    { value: "independencia", label: "Independencia", lat: -34.6200717, lng: -58.3837130, linea: "C" },
    { value: "moreno", label: "Moreno", lat: -34.6103445, lng: -58.3828383, linea: "C" },
    { value: "avdemayo", label: "Avenida de Mayo", lat: -34.60899098, lng: -58.38068279, linea: "C" },
    { value: "diagonal", label: "Diagonal Norte", lat: -34.6048383, lng: -58.3794651, linea: "C" },
    { value: "lavalle", label: "Lavalle", lat: -34.6020564, lng: -58.3781247, linea: "C" },
    { value: "sanmartin", label: "General San Martín", lat: -34.6008090, lng: -58.3848683, linea: "C" },
    { value: "retiroc", label: "Retiro", lat: -34.5916364, lng: -58.3748868, linea: "C" },

    // Línea D
    { value: "facultadmedicina", label: "Facultad de Medicina", lat: -34.5997270, lng: -58.3972006, linea: "D" },
    { value: "callao", label: "Callao", lat: -34.5996286, lng: -58.3925590, linea: "D" },
    { value: "tribunales", label: "Tribunales Teatro Colon", lat: -34.6015524, lng: -58.3850202, linea: "D" },
    { value: "9dejulio", label: "9 de Julio", lat: -34.6044707, lng: -58.3801163, linea: "D" },
    { value: "catedral", label: "Catedral", lat: -34.6076198, lng: -58.3742565, linea: "D" },

    // Línea E
    { value: "pichincha", label: "Pichincha", lat: -34.6232753, lng: -58.3995216, linea: "E" },
    { value: "entrerios-rodolfowalsh", label: "Entre Ríos - Rodolfo Walsh", lat: -34.6229760, lng: -58.3938755, linea: "E" },
    { value: "sanjose", label: "San José", lat: -34.6222576, lng: -58.3877218, linea: "E" },
    { value: "independenciae", label: "Independencia", lat: -34.6180704, lng: -58.3834729, linea: "E" },
    { value: "belgrano", label: "Belgrano", lat: -34.6124483, lng: -58.3810317, linea: "E" },
    { value: "bolivar", label: "Bolívar", lat: -34.6094245, lng: -58.3762727, linea: "E" },
    { value: "correocentral", label: "Correo Central", lat: -34.6031305, lng: -58.3729475, linea: "E" },
    { value: "catalinas", label: "Catalinas", lat: -34.5965586, lng: -58.3745719, linea: "E" },
    { value: "retiroe", label: "Retiro", lat: -34.5916364, lng: -58.3748868, linea: "E" }
  ];
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
      <OpenLayersMap paradas={paradas} paradaOrigen={paradaOrigen} paradaDestino={paradaDestino} onSelectOrigen={handleSelectParadaOrigen} onSelectDestino={handleSelectParadaDestino} trayecto={trayectosState} transbordos={transbordos}/>
        
      </div>
    
  )
}
