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

import { Bar } from 'react-chartjs-2'
import useRegularTxs from '@/hooks/useRegularTxs';
import DateSetter from '../ui/DateSetter';
import { period } from './BurnedFeesDoughnut';
import { formatDateForGHRepo, formatWeeklyDatesForGHRepo, formatMonthlyDatesForGHRepo } from '@/utils/utils';
import { Scale } from '@/types/types';
import LogLin from '../ui/LogLin';
import { scaleHelper } from '@/utils/utils';
import { COLORS } from '@/utils/constants';

type ChartData = {
  labels: string[],
  datasets: {
    label: string,
    data: number[],
    backgroundColor: string[],
    borderColor: string[],
    borderWidth: number,
    borderRadius: number,
  }[]
}

const RegTxsBar = () => {
  const {txDataRegular, fetchTxs} = useRegularTxs()
  const [chartData, setChartData] = useState<ChartData|null>(null)
  const [period, setPeriod] = useState<period>('weekly')
  const [selectedDate, setSelectedDate] = useState<Date|null>(null)
  const [selectedScale, setSelectedScale] = useState<Scale>(Scale.lin)
  const [maxDate, setMaxDate] = useState<Date|null>(null)

  // set the initial date to yesterday, the max date should also be yesterday and stay that way
  useEffect(() => {
    const yesterday = new Date(Date.now() - 864e5)
    setSelectedDate(yesterday)
    setMaxDate(yesterday)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchTxs(period, selectedDate)
    }
  }, [fetchTxs, selectedDate, period])


  // prepare the data for the chart
  useEffect(() => {
    setChartData(null)
    const groups: Record<string, number> = {};
    if (txDataRegular) {
      
      // loop through the txData
      txDataRegular.forEach((tx) => {

        const groupsToIgnore = ['System', 'governance', 'undefined','0']
        // if the group is in the ignore list, skip it
        if (groupsToIgnore.includes(tx.group)) {
          return
        }
   
        // if (tx.group === undefined) {
        //   return
        // }

        if (tx.group === "Code Metal Rewards Distribution") {
          tx.group = "Code Metal"
        }

        // if group doesn't exist, create it
        if (!groups[tx.group]) {
          groups[tx.group] = 0
        }
        // add the tx value to the group
        groups[tx.group] += Number(Number(tx["Regular Tx"]).toFixed())

        // remove the group if it's < 2
        if (groups[tx.group] < 2) {
          delete groups[tx.group]
        }
      })
    }

    // create the chart data
    const chartData:ChartData = {
      labels: Object.keys(groups),
      datasets: [
        {
          label: 'Regular Txs',
          data: Object.values(groups),
          backgroundColor: COLORS,
          borderColor: [
            'rgba(255, 255, 255, 0.6)',
          ],
          borderWidth: 1,
          borderRadius: 40,
        },
      ],
    }

    setChartData(chartData)
  }, [txDataRegular])


  const chartOptions = {
    scales: {
      myScale: {
        type: scaleHelper(selectedScale),
        position: 'right', // `axis` is determined by the position as `'y'`
        // axis: 'y',
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'left',
        align: 'center',
        labels: 
        {
          generateLabels: (chart:any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
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
          <h2 className="text-5xl font-bold">Regular Transactions</h2>   
        </div>
        <div className="flex items-center justify-between">
          <div>
            <input type="radio" id="daily_regular" name="period_regular" value="daily" checked={period === "daily"} onChange={() => setPeriod("daily")} />
            <label htmlFor="daily" className="ml-2 mr-8">Daily</label>
            <input type="radio" id="weekly_regular" name="period_regular" value="weekly" checked={period === "weekly"} onChange={() => setPeriod("weekly")} />
            <label htmlFor="weekly" className="ml-2 mr-8">Weekly</label>
            <input type="radio" id="monthly_regular" name="period_regular" value="monthly" checked={period === "monthly"} onChange={() => setPeriod("monthly")} />
            <label htmlFor="monthly" className="ml-2 mr-8">Monthly</label>
          </div>
          <DateSetter date={selectedDate} setDate={setSelectedDate} maxDate={maxDate}/>
        </div>
        <div className='text-sm text-gray-500 my-4'>
        { selectedDate && period === "daily" && <p>{formatDateForGHRepo(selectedDate)}</p>}
        { selectedDate && period === "weekly" && <p>{formatWeeklyDatesForGHRepo(selectedDate).replaceAll("_", " ")}</p>}
        { selectedDate && period === "monthly" && <p>{formatMonthlyDatesForGHRepo(selectedDate).replaceAll("_", " ")}</p>}
        </div>
        { chartData && 
        <div className="">
          <Bar 
            data={chartData} 
            options={chartOptions}
            className='w-[800px] h-[400px]'
          /> 
          <LogLin scale={selectedScale} setSelectedScale={setSelectedScale}/>
        </div>
        }
      </div>
    </div>
  )
}

export default RegTxsBar