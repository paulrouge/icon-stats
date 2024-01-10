import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
//#4eb3b1 //#63d2c5
const EOILink = () => {
  return (
    <Link 
    className='
    fixed top-4 right-4 rounded-full border border-gray-200 shadow-lg bg-[#63d2c5] z-50
    p-1 text-gray-700 hover:bg-[#4eb3b1] hover:text-gray-300 hover:scale-110 hover:rotate-[30deg] transition duration-300 ease-in-out
    '
    target="_blank"
    rel="noopener noreferrer"
    href="https://www.eyeonicon.xyz/#vote" 
    >
        {/* support us! */}
        <Image src="/eyeonicon_w.png" alt="Eye on Icon" width={40} height={40}/>
    </Link>
  )
}

export default EOILink