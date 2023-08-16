export type txDataResponse = {
    to: string,
    ["Regular Tx"]: number,
    ["Fees burned"]: number,
    ["to_def"]: string,
    ["Internal Tx"]: number,
    ["Internal Event (excluding Tx)"]: number,
    group: string,
}

export type tokenDataResponse = {
    ["IRC Token"]: string,
    holders: number,
    liquidity: number,
    amount: number,
    ["No. of Transactions"]: number,
    ["Price in USD"]: number,
    ["Value Transferred in USD"]: number,
}