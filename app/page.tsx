
'use client'
import { Noto_Sans, Rubik } from 'next/font/google'
import BurnedFeesDonut from '@/components/charts/BurnedFeesDonut'

const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700'],
})

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '700'],
})


export default function Home() {

  return (
    <main 
    className={`
    flex min-h-screen flex-col items-center justify-between p-24 text-gray-900
    ${rubik.className}
    `}>
      <BurnedFeesDonut />
    </main>
  )
}
