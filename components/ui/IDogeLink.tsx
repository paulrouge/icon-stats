import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
//#4eb3b1 //#63d2c5
const IDogeLink = () => {
    const images = [
        "/DogeBG01.png",
        "/DogeBG02.png",
        "/DogeBG03.png",
        "/DogeBG04.png",
        "/DogeBG05.png",
        "/DogeBG06.png",
    ]

    const randomImage = images[Math.floor(Math.random() * images.length)]
  
    return (
    <div className='fixed top-4 left-4 h-[50px] w-48 bg-gray-50 rounded z-50'>
        <Link 
        className='overflow-hidden h-[50px] w-[50px] absolute top-0 left-0
        rounded-full border border-gray-200 shadow-lg bg-pink-400
        text-gray-700 hover:bg-green-400 hover:text-gray-300 hover:scale-110 hover:rotate-[-30deg] transition duration-300 ease-in-out
        '
        href="https://www.idogelabs.com/" 
        >
            <div className=''>
                <Image src={randomImage} alt="Legendary iDoge NFT" className="absolute " width={120} height={120}/>
            </div>

        </Link>
        <Link  href="https://www.idogelabs.com/"  className='absolute top-2 left-16 text-xs text-gray-400 transition duration-300 ease-in-out hover:text-gray-500'>Brought to you by iDoge Labs et al.</Link>
    </div>
  )
}

export default IDogeLink