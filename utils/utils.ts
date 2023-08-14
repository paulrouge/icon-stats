import { period } from "@/components/charts/BurnedFeesDonut"
import { baseURLTransactionData } from "./constants"


export const urlBuilderTransactions = (_dateString: string, _period: period) => {  
    let url = ''

    if (_period === 'monthly') {
        url = baseURLTransactionData + 'monthly/' + _dateString + '/tx_summary_' + _dateString +'.csv'
    } else if (_period === 'weekly') {
        url = baseURLTransactionData + 'weekly/' + _dateString + '/tx_summary_'+ _dateString + '.csv'
    } else {
        const year = _dateString.split('-')[0]
        url = baseURLTransactionData + year + '/' + 'tx_summary_' + _dateString + '.csv'
    }

  return url
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

// function that takes in a date and returns a string if date and date 6 days prior
export const formatWeeklyDatesForGHRepo = (date: Date) => {
    const lastDay = formatDateForGHRepo(date)
    // first day is 6 days prior
    const firstDay = formatDateForGHRepo(new Date(date.getTime() - 6 * 24 * 60 * 60 * 1000))

    return `${firstDay}_to_${lastDay}`
}

// function that takes in a date and returns a string if date and date 29 days prior
export const formatMonthlyDatesForGHRepo = (date: Date) => {
    const lastDay = formatDateForGHRepo(date)
    // first day is 29 days prior
    const firstDay = formatDateForGHRepo(new Date(date.getTime() - 29 * 24 * 60 * 60 * 1000))

    return `${firstDay}_to_${lastDay}`
}