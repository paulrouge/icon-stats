
'use client'
import { Inter, Noto_Sans, Rubik } from 'next/font/google'
import BurnedFeesDonut from '@/components/charts/BurnedFeesDonut'
import RegTxsBar from '@/components/charts/RegTxsBar'
import InternalTxsBar from '@/components/charts/InternalTxsBar'

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
    flex min-h-screen flex-col items-center justify-between md:p-24 text-gray-900 gap-12
    ${rubik.className}
    `}>
      <BurnedFeesDonut />
      <RegTxsBar />
      <InternalTxsBar />
    </main>
  )
}
