import React, {use, useEffect, useState} from 'react'
import { txDataResponse } from '@/types/types';
import { urlBuilderTransactions, formatDateForGHRepo } from '@/utils/utils';
import { period } from '@/components/charts/BurnedFeesDonut';

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


const ghRepo = 'https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/08_transaction_data/results/2023/tx_summary_2023-06-29.csv'
// const baseURLTransactionData = `https://raw.githubusercontent.com/Transcranial-Solutions/ICONProject/master/data_analysis/08_transaction_data/results/`


// monhtly tx data example url:
// baseURLTransactionData + monthly/2023-07-03_to_2023-08-01/tx_summary_2023-07-03_to_2023-08-01.csv
// weekly tx data example url:
// baseURLTransactionData + weekly/2023-07-30_to_2023-08-05/tx_summary_2023-07-30_to_2023-08-05.csv

const useFetchTxData = () => {
  const [csvData, setCsvData] = useState('');
  const [txData, setTxData] = useState<txDataResponse[]>([]);
  const [date, setDate] = useState<Date|null>(null);
  const [txDailyUrl, setTxDailyUrl] = useState<string|null>(null);

  useEffect(() => {
    if (date) {
      const url = urlBuilderTransactions(formatDateForGHRepo(date),'daily')
      
      setTxDailyUrl(url)
    }
  }, [date])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(txDailyUrl!);
        if (response.ok) {
          const data = await response.text();
          setCsvData(data);
        } else {
          console.error('Request failed with status', response.status);
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
    };

    if (txDailyUrl){
      fetchData();
    }
    // fetchData();
  }, [txDailyUrl]);

  useEffect(() => {
      if (csvData) {
          const rows = csvData.split('\n');
          const headers = rows[0].split(',');
          const txData = rows.slice(1).map(row => {
              const values = row.split(',');
              const txData: txDataResponse = {
                  to: values[0],
                  ["Regular Tx"]: Number(values[1]),
                  ["Fees burned"]: Number(values[2]),
                  ["to_def"]: values[3],
                  ["Internal Tx"]: Number(values[4]),
                  ["Internal Event (excluding Tx)"]: Number(values[5]),
                  group: values[6],
              }
              return txData
          })
          setTxData(txData)
      }
  }, [csvData])

  const fetchDailyTxs= async (_period:period, _date:Date) => {
    const formattedDate = formatDateForGHRepo(_date)
    const url = urlBuilderTransactions(formattedDate, 'daily')

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
    txData,
    fetchDailyTxs
  }
}

export default useFetchTxData