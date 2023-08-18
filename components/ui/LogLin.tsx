import React, {useState} from 'react'
import { Scale } from '@/types/types'

type Props = {
    scale: Scale
    //set useState
    setSelectedScale: React.Dispatch<React.SetStateAction<Scale>>

}

function LogLin(props: Props) {
    // const [selectedScale, setSelectedScale] = useState<Scale>(Props.scale)
    

    
    return (
    <div className='flex gap-2 text-xs w-full justify-end'>
        <p
        onClick={() => props.setSelectedScale(Scale.lin)}
        className={`cursor-pointer ${props.scale === Scale.lin ? 'text-gray-600 font-bold' : 'text-gray-300'}`}
        >
            lin
        </p>
        <p
        onClick={() => props.setSelectedScale(Scale.log)}
        className={`cursor-pointer ${props.scale === Scale.log ? 'text-gray-600 font-bold' : 'text-gray-300'}`}
        >
            log
        </p>
    </div>
  )
}

export default LogLin