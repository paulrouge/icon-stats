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

export type trendsResponse = {
    date: string,
    ["Regular Tx"]: number,
    ["Fees burned"]: number,
    ["Internal Tx"]: number,
    ["Internal Event (excluding Tx)"]: number,
    ["Regular & Interal Tx	"]: number,
    ["Regular & Interal Tx (MA7)"]: number,
    ["Regular & Interal Tx (MA30)"]: number,
    ["Fees burned (MA7)"]: number,
    ["Fees burned (MA30)"]: number,
}

export type exchangeDataResponse = {
    address: string,
    estimatedICX: number,
    stake: number,
    totalDelegated: number,
    balance: number,
    unstake: number,
    unstakeBlockHeight: number,
    remainingBlocks: number,
    totalBonded: number,
    total: number,
    names: string,
}

// log / lin enum
export enum Scale {
    log = 'log',
    lin = 'lin',
}
