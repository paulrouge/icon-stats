import React, {useEffect, useState } from 'react'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  LogarithmicScale
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  LogarithmicScale
)
import DateSetter from '../ui/DateSetter';
import { Bar } from 'react-chartjs-2'
import useTokenTransfers from '@/hooks/useTokenTransfers';
import { Scale } from '@/types/types';
import LogLin from '../ui/LogLin';
import { scaleHelper } from '@/utils/utils';
import { COLORS } from '@/utils/constants';

type ChartData = {
  labels: string[],
  datasets: {
    label: string,
    data: number,
    backgroundColor: string[],
    borderColor: string[],
    borderWidth: number,
    borderRadius: number,
    stack?: string,
  }[]
}

type options = 'transactions' | 'USD value transfered' | 'holders' | 'token amount'

const helperObj = {
  transactions: 'transactions',
  ['USD value transfered']: 'usdValue',
  holders: 'holders',
  ['token amount']: 'tokenAmount',
}

const TokenTransfersBarChart = () => {
  const { tokenTransferData, fetchTxs } = useTokenTransfers()
  const [chartData, setChartData] = useState<ChartData|null>(null)
  const [selectedDate, setSelectedDate] = useState<Date|null>(null)
  const [maxDate, setMaxDate] = useState<Date|null>(null)
  const [selectedScale, setSelectedScale] = useState<Scale>(Scale.log)
  const [option, setOption] = useState<options>('transactions')
  const [tokenNames, setTokenNames] = useState<string[]>([])


  // hold the data for the chart
  const [arrs, setArrs] = useState<any>({})

  // set the initial date to yesterday, the max date should also be yesterday and stay that way
  useEffect(() => {
    const yesterday = new Date(Date.now() - 864e5)
    setSelectedDate(yesterday)
    setMaxDate(yesterday)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchTxs(selectedDate)
    }
  }, [fetchTxs, selectedDate])

 // prepare the data for the chart
 useEffect(() => {
  // setChartData(null)
  setTokenNames([])
  
  if (tokenTransferData) {
    tokenTransferData.forEach((token) => {
      setTokenNames((tokenNames) => [...tokenNames, token['IRC Token']])
    })
  }

  // prepare the datasets for the chart
  const prepareDataSets = () => {
    const combinedArrays:any = {}
    const holdersArr:number[] = []
    const transactionsArr:number[] = []
    const tokenAmountArr:number[] = []
    const usdValueArr:number[] = []

    tokenTransferData.forEach((token, index) => {

      const tokenName = token['IRC Token']
      const holders = token['holders']
      const transactions = token['No. of Transactions']
      const tokenAmount = token['amount']
      const usdValue = token['Value Transferred in USD']
      const liquidity = token['liquidity']

      holdersArr.push(holders)
      transactionsArr.push(transactions)
      tokenAmountArr.push(tokenAmount)
      usdValueArr.push(usdValue)

    })

    combinedArrays['holders'] = holdersArr
    combinedArrays['transactions'] = transactionsArr
    combinedArrays['tokenAmount'] = tokenAmountArr
    combinedArrays['usdValue'] = usdValueArr

    setArrs(combinedArrays)

  }

  if(tokenTransferData){
    prepareDataSets()
  }

}, [tokenTransferData, option])

// prepare the data for the chart
useEffect(() => {
  // create the chart data
  const chartData:ChartData = {
    labels: tokenNames,
    datasets: [
      {
        label: option,
        data: arrs[helperObj[option]],
        backgroundColor: COLORS,
        borderColor: [
          'rgba(255, 255, 255, 0.6)',
        ],
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  }

  setChartData(chartData)

}, [arrs, option, tokenNames])

const chartOptions = {
  scales: {
    myScale: {
      type: scaleHelper(selectedScale),
      position: 'right', // `axis` is determined by the position as `'y'`
    }
  },
  plugins: {
    legend: {
      display: false,
    },
  },
} as any;

return (
  <div className='w-full lg:w-2/3'>
    <div className="md:py-6 md:px-12 p-2 rounded-xl border rounded-xl bg-white shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="lg:text-5xl text-2xl font-bold">Token Transfers</h2>   
      </div>
        <div className="flex items-center justify-between mb-4 flex-col md:flex-row text-xs md:text-base gap-4 md:gap-0">
          <div className='flex flex-col lg:flex-row gap-2 lg:gap-0'>
            <div className='flex items-center'>
              <input type="radio" id="transactions" name="option" value="transactions" checked={option === 'transactions'} onChange={() => setOption('transactions')}/>
              <label className="ml-2 mr-8" htmlFor="transactions">Transactions</label>
            </div>
            <div className='flex items-center'>
              <input type="radio" id="USD value transfered" name="option" value="USD value transfered" checked={option === 'USD value transfered'} onChange={() => setOption('USD value transfered')}/>
              <label className="ml-2 mr-8" htmlFor="USD value transfered">USD value transfered</label>
            </div>
            <div className='flex items-center'>
              <input type="radio" id="holders" name="option" value="holders" checked={option === 'holders'} onChange={() => setOption('holders')}/>
              <label className="ml-2 mr-8" htmlFor="holders">Holders</label>
            </div>
            <div className='flex items-center'>
              <input type="radio" id="token amount" name="option" value="token amount" checked={option === 'token amount'} onChange={() => setOption('token amount')}/>
              <label className="ml-2 mr-8" htmlFor="token amount">Token amount</label>
            </div>
          </div>
          <div className="text-xs lg:text-base">
            <DateSetter date={selectedDate} setDate={setSelectedDate} maxDate={maxDate}/>
          </div>
        </div>
      { chartData && 
      <div className="relative w-full">
        <Bar 
          data={chartData} 
          options={chartOptions}
          className='w-full h-full'
        /> 
        <LogLin scale={selectedScale} setSelectedScale={setSelectedScale}/>
      </div>
      }
    </div>
  </div>
)
}

export default TokenTransfersBarChart