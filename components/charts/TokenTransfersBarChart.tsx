import React, {useEffect, useState, useRef} from 'react'
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
import { Doughnut } from 'react-chartjs-2';
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
import { Line, Bar, Scatter, Bubble, getElementAtEvent } from 'react-chartjs-2'
import useTokenTransfers from '@/hooks/useTokenTransfers';

type ChartData = {
  labels: string[],
  datasets: {
    label: string,
    data: number,
    backgroundColor: string[],
    borderColor: string[],
    borderWidth: number,
    stack?: string,
  }[]
}

  
// array of colors for the chart
const bgColors:string[] = ['#54478c', '#2c699a', '#048ba8', '#0db39e', '#16db93', '#83e377', '#b9e769', '#efea5a', '#f1c453', '#f29e4c', '#f4845f', '#f76f8e', '#e15b97', '#c9406a', '#a9225c', '#831843', '#4b202e', '#2a0c3a', '#050c3a', '#0c2e3d', '#183d3f', '#1e4d2b', '#1e4d2b', '#345e3f', '#4b6e51', '#627e63', '#7a8e75', '#93a085', '#aeb096', '#c8c8a9', '#e3e3bd', '#ffffd4']

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
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [option, setOption] = useState<options>('transactions')
  
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
  const tokenNames: string[] = []
  
  if (tokenTransferData) {
    tokenTransferData.forEach((token) => {
      tokenNames.push(token['IRC Token'])
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

  // create the chart data
  const chartData:ChartData = {
    labels: tokenNames,
    datasets: [
      {
        label: option,
        data: arrs[helperObj[option]],
        backgroundColor: bgColors,
        borderColor: [
          'rgba(255, 255, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  }

  setChartData(chartData)
}, [tokenTransferData, option])

const getPos = () => {
  if (windowWidth < 768) {
    return 'bottom'
  } else {
    return 'left'
  }
}

const chartOptions = {
  scales: {
    myScale: {
      type: 'logarithmic',
      position: 'right', // `axis` is determined by the position as `'y'`
    }
  },
  plugins: {
    legend: {
      position: getPos(),
      align: 'center',
      maintainAspectRatio: false,
      responsive: true,
      display: false,
      labels: {
        generateLabels: (chart:any) => {
          if (windowWidth < 768) {
            return []
          }
          const data = chart.data;

          if (data.labels.length && data.datasets.length) {
            // console.log('amount of entries', data.labels.length, data)
            
            return data.labels.map((label:string, index:number) => {
              const dataset = data.datasets[0];
              const value = dataset.data[index].toFixed(0);
              const backgroundColor = dataset.backgroundColor[index];
              const borderColor = dataset.borderColor[index];

              return {
                text: `${label}: ${value}`,
                fillStyle: backgroundColor,
                strokeStyle: borderColor,
                lineWidth: 1,
                hidden: false,
                index: index,
              };
            });
          }
          return [];
        },
      },        
    },
  },
} as any;

return (
  <div>
    <div className="py-6 px-12 rounded-xl border rounded-xl bg-white shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="md:text-5xl text-2xl font-bold">Token Transfers</h2>   
      </div>
        <div className="flex items-center justify-between">
          <div>
            <input type="radio" id="transactions" name="option" value="transactions" checked={option === 'transactions'} onChange={() => setOption('transactions')}/>
            <label className="ml-2 mr-8" htmlFor="transactions">Transactions</label>
            <input type="radio" id="USD value transfered" name="option" value="USD value transfered" checked={option === 'USD value transfered'} onChange={() => setOption('USD value transfered')}/>
            <label className="ml-2 mr-8" htmlFor="USD value transfered">USD value transfered</label>
            <input type="radio" id="holders" name="option" value="holders" checked={option === 'holders'} onChange={() => setOption('holders')}/>
            <label className="ml-2 mr-8" htmlFor="holders">Holders</label>
            <input type="radio" id="token amount" name="option" value="token amount" checked={option === 'token amount'} onChange={() => setOption('token amount')}/>
            <label className="ml-2 mr-8" htmlFor="token amount">Token amount</label>
          </div>
          <DateSetter date={selectedDate} setDate={setSelectedDate} maxDate={maxDate}/>
        </div>
      {/* </div> */}

      { chartData && 
      <div className="h-[400px] w-[800px] flex items-center justify-center">
        <Bar 
          data={chartData} 
          options={chartOptions}
          className='w-full h-full'
        /> 
      </div>
      }
    </div>
  </div>
)
}

export default TokenTransfersBarChart