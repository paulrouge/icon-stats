import React, {use, useEffect, useState} from 'react'
import { txDataResponse } from '@/types/types';
import { urlBuilderTransactions, formatDateForGHRepo, formatWeeklyDatesForGHRepo, formatMonthlyDatesForGHRepo } from '@/utils/utils';
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

const useInternalTxs = () => {
  const [csvData, setCsvData] = useState('');
  const [txDataInternal, setTxDataInternal] = useState<txDataResponse[]>([]);

  useEffect(() => {
    if (csvData) {
      const rows = csvData.split('\n');
      // const headers = rows[0].split(',');
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
      
      // sort by internal txs
      txData.sort((a, b) => b["Internal Tx"] - a["Internal Tx"])

      // get top 15, and then sum the rest
      const top15 = txData.slice(0, 25)
      const rest = txData.slice(25)

      const sumRest: txDataResponse = {
        to: 'Cumulative Rest',
        ["Regular Tx"]: 0,
        ["Fees burned"]: 0,
        to_def:  "",
        ["Internal Tx"]: 0,
        ["Internal Event (excluding Tx)"]: 0,
        group: 'Cumulative Rest',
      }

      let counter = 0
      
      rest.forEach(tx => {
        // only process internal txs is needed
        const iTxs = tx["Internal Tx"]

        // if iTxs is not a number or 0 continue
        if (!iTxs || iTxs === 0) {
          return
        }
        counter += iTxs
      })

      sumRest["Internal Tx"] = counter

      const txDataTop15 = [...top15, sumRest]
      setTxDataInternal(txDataTop15)

    }
  }, [csvData])

  const fetchTxs= async (_period:period, _date:Date) => {
    let url = ''
    
    if(_period === 'daily') {
      const formattedDate = formatDateForGHRepo(_date)
      url = urlBuilderTransactions(formattedDate, 'daily')
    } else if (_period === 'weekly') {
      const formattedDate = formatWeeklyDatesForGHRepo(_date)
      url = urlBuilderTransactions(formattedDate, 'weekly')
    } else {
      const formattedDate = formatMonthlyDatesForGHRepo(_date)
      url = urlBuilderTransactions(formattedDate, 'monthly')
    }

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
    txDataInternal,
    fetchTxs,
  }
}

export default useInternalTxs