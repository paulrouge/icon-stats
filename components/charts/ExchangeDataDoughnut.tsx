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
  ArcElement
)
import { exchangeDataResponse } from '@/types/types';
import { COLORS } from '@/utils/constants';
import useExchangeData from '@/hooks/useExchangeData';
import DateSetter from '../ui/DateSetter';

type ChartData = {
  labels: string[],
  datasets: {
    label: string,
    data: number[],
    backgroundColor: string[],
    borderColor: string[],
    borderWidth: number,
  }[]
}

// array of colors for the chart
// const bgColors:string[] = [
//   '#54478c', '#2c699a', '#d18da9', '#0db39e', '#f197a2', '#83e377',
//   '#b9e769', '#2a9d8f', '#e57373', '#175676', '#f4845f', '#f76f8e',
//   '#e15b97', '#2c699a', '#d18da9', '#0db39e', '#f197a2', '#83e377',
//   '#b9e769', '#2a9d8f', '#e57373', '#175676', '#f4845f', '#f76f8e',
//   '#e15b97', '#54478c', '#d18da9', '#0db39e', '#f197a2', '#83e377'
// ]; 

export type period = 'daily' | 'weekly' | 'monthly'

const ExchangeDataDonut = () => {
  const {exchangeData, fetchExchangeData} = useExchangeData()
  const [chartData, setChartData] = useState<ChartData|null>(null)
  const [selectedDate, setSelectedDate] = useState<Date|null>(null)
  const [maxDate, setMaxDate] = useState<Date|null>(null)
  const chartRef = useRef();
 
  // set the initial date to yesterday, the max date should also be yesterday and stay that way
  useEffect(() => {
    const yesterday = new Date(Date.now() - 864e5)
    setSelectedDate(yesterday)
    setMaxDate(yesterday)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchExchangeData(selectedDate)
    }
  }, [fetchExchangeData, selectedDate])

  // prepare the data for a donut chart
  useEffect(() => {
    const totals:number[] = []
    const labels:string[] = []
    if (exchangeData) {
      // loop through the data and add the totals to the totals array
      exchangeData.forEach((item:exchangeDataResponse) => {
        const _total = Math.floor(item.total)
        if (_total === 0) {
          return
        }
        if (item.names === undefined) {
          return
        }
        totals.push(_total)
        labels.push(item.names)
      })
    }

    // create the chart data
    const chartData:ChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Balance',
          data: totals,
          backgroundColor: COLORS,
          borderColor: [
            'rgba(255, 255, 255, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    }

    setChartData(chartData)
  }, [exchangeData])


  const chartOptions = {
    plugins: {
      legend: {
        position: 'left',
        align: 'center',
        labels: 
        {
          generateLabels: (chart:any) => {
            const data = chart.data;
        
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label:string, index:number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[index];
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
    <div className='w-full lg:w-2/3'>
      <div className="md:py-6 md:px-12 p-2 rounded-xl border rounded-xl bg-white shadow-lg">
        <div className="flex flex-row items-center justify-between">
          <h2 className="lg:text-5xl text-2xl  font-bold">Exchange Balances</h2> 
          <div className="text-xs lg:text-base">
            <DateSetter date={selectedDate} setDate={setSelectedDate} maxDate={maxDate}/>
          </div>
        </div>
        { chartData && 
          <div className="relative w-full h-full">
            <Doughnut 
              data={chartData} 
              options={chartOptions}
              className='w-full h-full'
              ref={chartRef}
              // onClick={onClick}
            /> 
          </div>
        }
      </div>
    </div>
  )
}

export default ExchangeDataDonut