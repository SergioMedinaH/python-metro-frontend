import { cn } from "@/lib/utils";
import ItemTrayecto from "./itemtrayecto";
import { ArrowUpDown, ChevronRight, LogOut, TrainFront } from "lucide-react";
import { Trayecto } from "@/types/global";

export default function TrayectoComponente({trayecto}: {trayecto: Trayecto}) {
    const tiempoTotal = trayecto.tiempos.reduce((acumulador: number, tiempo: number) => acumulador + tiempo, 0)

    if (trayecto.linea === 'Transbordo') {
        return <div key={trayecto.linea + trayecto.paradas[0]} className='flex border-b w-full mt-2 pb-2'>
        <div className='h-full w-[5px]text-gray-500'/>
        <div className="flex flex-col gap-2 p-2 w-full">
            <div className="flex justify-between gap-2 font-bold text-lg"> 
                <div className='flex gap-4 items-center'>
                    <span className=''>Transbordo</span>
                    <div className="flex">
                    <div className={cn(
                        'w-5 h-5 rounded-sm flex text-center items-center justify-center text-white',
                        trayecto.paradas[0].linea === 'A' && 'bg-lineaA',
                        trayecto.paradas[0].linea === 'B' && 'bg-lineaB',
                        trayecto.paradas[0].linea === 'C' && 'bg-lineaC',
                        trayecto.paradas[0].linea === 'D' && 'bg-lineaD',
                        trayecto.paradas[0].linea === 'E' && 'bg-lineaE',
                        )}>{trayecto.paradas[0].linea}</div>
                        <ChevronRight className='w-5 h-5'/>
                        <div className={cn(
                        'w-5 h-5 rounded-sm flex text-center items-center justify-center text-white',
                        trayecto.paradas[1].linea === 'A' && 'bg-lineaA',
                        trayecto.paradas[1].linea === 'B' && 'bg-lineaB',
                        trayecto.paradas[1].linea === 'C' && 'bg-lineaC',
                        trayecto.paradas[1].linea === 'D' && 'bg-lineaD',
                        trayecto.paradas[1].linea === 'E' && 'bg-lineaE',
                        )}>{trayecto.paradas[1].linea}</div>
                    </div>
                </div>
                <span className=''>{Math.round(tiempoTotal / 60)} min{tiempoTotal > 60 && "s"}</span>
            </div>
                
            <div className='flex flex-col gap-1'>
                    <div className="flex gap-2 items-center">
                        <div className={cn(
                        'w-5 h-5 rounded-sm flex text-center font-bold items-center justify-center text-white',
                        trayecto.paradas[0].linea === 'A' && 'bg-lineaA',
                        trayecto.paradas[0].linea === 'B' && 'bg-lineaB',
                        trayecto.paradas[0].linea === 'C' && 'bg-lineaC',
                        trayecto.paradas[0].linea === 'D' && 'bg-lineaD',
                        trayecto.paradas[0].linea === 'E' && 'bg-lineaE',
                        )}>{trayecto.paradas[0].linea}</div>
                        <div className="flex justify-between w-full">
                        <p>{trayecto.paradas[0].label}</p>
                        </div>
                        
                    </div>
                    <ArrowUpDown className='w-5 h-5'/>
                    <div className="flex gap-2 items-center">
                    <div className={cn(
                    'w-5 h-5 rounded-sm flex text-center font-bold items-center justify-center text-white',
                    trayecto.paradas[1].linea === 'A' && 'bg-lineaA',
                    trayecto.paradas[1].linea === 'B' && 'bg-lineaB',
                    trayecto.paradas[1].linea === 'C' && 'bg-lineaC',
                    trayecto.paradas[1].linea === 'D' && 'bg-lineaD',
                    trayecto.paradas[1].linea === 'E' && 'bg-lineaE',
                    )}>{trayecto.paradas[1].linea}</div>
                    <div className="flex justify-between w-full">
                    <p>{trayecto.paradas[1].label}</p>
                    <p className="text-sm text-black/60">{Math.round(trayecto.tiempos[0] / 60)} min{Math.round(trayecto.tiempos[0] / 60) > 1 && "s"}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    } else {
        if (trayecto.paradas.length > 1) {
            return(
                <div key={trayecto.linea + trayecto.paradas[0]} className='flex border-b w-full mt-2'>
                <div className="flex flex-col gap-2 p-2 w-full">
                    <div className="flex justify-between gap-2 font-bold text-lg">
                        <span className={cn(
                            '',
                            trayecto.linea === 'A' && 'text-lineaA',
                            trayecto.linea === 'B' && 'text-lineaB',
                            trayecto.linea === 'C' && 'text-lineaC',
                            trayecto.linea === 'D' && 'text-lineaD',
                            trayecto.linea === 'E' && 'text-lineaE',
                            )}>Línea {trayecto.linea}</span>
                        {tiempoTotal > 0 && <span className=''>{tiempoTotal} min{tiempoTotal > 1 && "s"}</span>}
                    </div>
                    
                    <div className="flex justify-between gap-2">
                        <p className='text-sm text-black/60 flex gap-1 items-center'><TrainFront className='w-4 h-4 text-black'/>Espera <span className="font-bold">{Math.round(trayecto.tiempoEspera/60)} min{ Math.round(trayecto.tiempoEspera/60) !== 1 && "s"}</span> | <span className="font-bold">{trayecto.horaSalida}</span></p>
                        <p className='text-sm text-black/60 items-center'><span className="font-bold">{Math.round(trayecto.tiempoEspera/60)}</span>, {Math.round(trayecto.tiempoEspera/60) + trayecto.paradas[0].frecuencia}, {Math.round(trayecto.tiempoEspera/60) + 2 * trayecto.paradas[0].frecuencia} mins</p>
                    </div>
                    {/*
                        <p className="text-sm text-black/60">Sentido: <span className="font-bold">Catedral</span></p>
                     */}
                    
                    
                    <div className="flex flex-col">
                        {trayecto.paradas.map((parada, index) => (
                            <ItemTrayecto parada={parada} tiempo={trayecto.tiempos[index-1]} key={index} especial={index === 0 || index === trayecto.paradas.length - 1} ultimo={index === trayecto.paradas.length - 1}/>
                        ))}
                    </div>
                    
                    <p className='mb-2 text-sm text-black/60 flex gap-1 items-center'><LogOut className='w-4 h-4 text-black'/> Sales <span className="font-bold">{Math.round(trayecto.tiempoEsperaSalida/60)} mins</span> despues | <span className="font-bold">{trayecto.horaFin}</span></p>
                     
                </div>
            </div>
            )
        }else {
            return <></>
        }
    }
}