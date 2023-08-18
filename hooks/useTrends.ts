import { useEffect, useState} from 'react'
import { trendsResponse } from '@/types/types';
import { urlBuilderTransactions, formatDateForGHRepo, formatWeeklyDatesForGHRepo, formatMonthlyDatesForGHRepo } from '@/utils/utils';

/**
 * to do:
 * transactions - daily, weekly, monthly
 * internal transactions - daily, weekly, monthly
 * burned ICX - daily, weekly, monthly
 * Trends
 * IRC Tokens - Daily token transfers
 * Exhange Data
 * 
 * 
 * 1. I think we need a function that builds the URL based on the date
 * 2. We need to fetch the data from the URL
 * 3. make a usestate for each of the data types, that is set by the fetch function
 */

const useTrends = () => {
  const [csvData, setCsvData] = useState('');
  const [trends, setTrends] = useState<trendsResponse|null>(null);

  // useEffect(() => {
  //   if (csvData) {
  //     const rows = csvData.split('\n');
  //     // const headers = rows[0].split(',');
  //     const trendData = rows.slice(1).map(row => {
  //       const values = row.split(',');
  //       const trendData: trendsResponse = {
          
  //       }
  //       return trendData
  //     })


  //     setTrends(trendData)
  //   }
  // }, [csvData])

  const fetchTrends= async (_date:Date) => {
    // https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/08_transaction_data/results/2023/tx_trend_2023-08-15.csv
    const date = formatDateForGHRepo(_date).replaceAll('_', '-')
    const year = date.split('-')[0]
    let url = `https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/08_transaction_data/results/${year}/tx_trend_${date}.csv`
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.text();
        setCsvData(data);
      } else {
        console.error('Request failed with status', response.status);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  }

  return { 
    trends,
    fetchTrends,
  }
}

export default useTrends