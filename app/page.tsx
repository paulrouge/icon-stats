
'use client'

import { Inter, Noto_Sans, Rubik } from 'next/font/google'
import BurnedFeesDonut from '@/components/charts/BurnedFeesDoughnut'
import RegTxsBar from '@/components/charts/RegTxsBar'
import InternalTxsBar from '@/components/charts/InternalTxsBar'
import TokenTransfersBarChart from '@/components/charts/TokenTransfersBarChart'
import ExchangeDataDonut from '@/components/charts/ExchangeDataDoughnut'
import TrendLines from '@/components/charts/TrendLines'
import EOILink from '@/components/ui/EOILink'
import WidthWarningBar from '@/components/ui/WidthWarningBar'
import IDogeLink from '@/components/ui/IDogeLink'

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
    <div 
    className={`h-full w-full px-2 py-2 flex flex-col items-center justify-center md:p-24 text-gray-900 gap-12
    ${rubik.className}
    `}>
      <WidthWarningBar />
      <EOILink />
      <IDogeLink />
      <TrendLines />
      <BurnedFeesDonut />
      <RegTxsBar />
      <InternalTxsBar />
      <TokenTransfersBarChart /> 
      <ExchangeDataDonut />
    </div>
  )
}
