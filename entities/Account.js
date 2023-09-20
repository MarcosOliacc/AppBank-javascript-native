import { Deposit } from "./Deposit.js"
import { Transfers } from "./Transfers.js"

export class Account {
    constructor(fullName,email,password,account) {
        this.fullName = fullName
        this.Email = email
        this.password = password
        this.account = account
        this.extrat = []
        this.balance = 0
    }
}

