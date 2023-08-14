import { period } from "@/components/charts/BurnedFeesDonut"
import { baseURLTransactionData } from "./constants"


export const urlBuilderTransactions = (_dateString: string, _period: period) => {  
    // monhtly tx data example url:
    // baseURLTransactionData + monthly/2023-07-03_to_2023-08-01/tx_summary_2023-07-03_to_2023-08-01.csv
    // weekly tx data example url:
    // baseURLTransactionData + weekly/2023-07-30_to_2023-08-05/tx_summary_2023-07-30_to_2023-08-05.csv
  
    
    let url = ''

    if (_period === 'monthly') {
        const s = ''
        url = baseURLTransactionData + '/' + 'tx_summary_' + '.csv'
    } else if (_period === 'weekly') {
        const s = ''  
        url = baseURLTransactionData + 'weekly/' + 'tx_summary_' + '.csv'
    } else {
        const year = _dateString.split('-')[0]
        url = baseURLTransactionData + year + '/' + 'tx_summary_' + _dateString + '.csv'
    }

  return url
}

// function that takes in 1 month number and returns the first and last day of that month
export const formatWeeklyDatesForGHRepo = (date: Date) => {
    const lastDay = formatDateForGHRepo(date)
    // first day is 6 days prior
    const firstDay = formatDateForGHRepo(new Date(date.getTime() - 6 * 24 * 60 * 60 * 1000))

    return `${firstDay}_to_${lastDay}`
}

// function that takes in a date and formats in YYYY-MM-DD
export const formatDateForGHRepo = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // number to string prepended with 0 if less than 10
    const dayString = day < 10 ? '0' + day.toString() : day.toString()

    // month to string prepended with 0 if less than 10
    const monthString = month < 10 ? '0' + month.toString() : month.toString()

    return `${year}-${monthString}-${dayString}`
}