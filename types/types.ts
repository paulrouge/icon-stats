export type txDataResponse = {
    to: string,
    ["Regular Tx"]: number,
    ["Fees burned"]: number,
    ["to_def"]: string,
    ["Internal Tx"]: number,
    ["Internal Event (excluding Tx)"]: number,
    group: string,
}