import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const EOILink = () => {
  return (
    <Link 
    className='
    text-sm flex items-center gap-2 fixed top-4 right-4 rounded-full border border-gray-200 bg-gray-50 shadow-lg
    p-1 text-gray-700 hover:bg-[#60cec2] hover:text-gray-300 hover:scale-110 hover:rotate-[30deg] transition duration-300 ease-in-out
    '
    target="_blank"
    rel="noopener noreferrer"
    href="https://www.eyeonicon.xyz/#vote" 
    >
        {/* support us! */}
        <Image src="/eyeonicon.png" alt="Eye on Icon" width={40} height={40}/>
    </Link>
  )
}

export default EOILink