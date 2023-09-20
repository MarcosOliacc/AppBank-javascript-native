import { Account } from "./Account.js"
import { Deposit } from "./Deposit.js"
import { Transfers } from "./Transfers.js"

const accountsNUmbers = ['1234','4321','5678','8765','6789','9876']
export class App {
    static #users = []

    static getDates(){
        const fullDate = new Date()
        const day = fullDate.getDate()
        const month = fullDate.getMonth() + 1
        const year = fullDate.getFullYear()
        const date = `${day}/${month}/${year}`
        return date
    }
    static retu(){
        return this.#users
    }
    static async reloadUsers(){
        this.#users = []
        const users = await fetch('http://localhost:3000/Accounts').then(res=> res.json())
        users.forEach(user=> this.#users.push(user))
    }
    static createAccount(fullName,email,password) {
        if(this.#users.map(o=>o.Email).indexOf(email)=== -1){
            const newUser = new Account(fullName, email, password, accountsNUmbers[this.#users.length])
            this.#users.push(newUser)
            const response = fetch('http://localhost:3000/Accounts', {
                method: 'POST',
                headers: {'content-Type': 'application/json'},
                body: JSON.stringify(newUser)
            })
            return 2
        }else {
            return alert('Essa conta já existe.')
        }
    }
    static enterAccount(email,password) {
        console.log(this.#users)
        const index = this.#users.map(o => o.Email).indexOf(email)
        if (index === -1) {
            alert('Email nao cadastrado.')
        } else if (this.#users[index].password !== password){
            alert('Senha incorreta.')
        } else {
            return index
        }
    }
    static async newDeposit(value,id){
        
        const index = this.#users.map(o=>o.id).indexOf(id)
        const user = this.#users[index]
        user.balance += Number(value)
        console.log(user)
        const deposit = new Deposit(value,App.getDates(),user.balance)

        
        user.extrat.push({deposit:deposit, saldo:user.balance})
        const response = await fetch(`http://localhost:3000/Accounts/${id}`,{
            method: 'PUT',
            headers: {'content-Type':'application/json'},
            body: JSON.stringify(user)
        })
        await App.reloadUsers()
    }
    static async newTransfer(valor,orig,dest) {
        
        const idest = this.#users.map(o=>o.account).indexOf(dest)
        const desiny = this.#users[idest]
        const iorig = this.#users.map(o=>o.id).indexOf(orig)
        const origin = this.#users[iorig]
        console.log(desiny)
        console.log(origin)
        if(idest === -1){
            alert('Essa conta não existe')
        }else if(idest === iorig){
            alert('Você não pode fazer transferência pra você mesmo.')
        } else if (origin.balance >= valor) {
            desiny.balance += Number(valor);origin.balance -= valor

            const transfer = new Transfers(valor,desiny.fullName,origin.fullName,App.getDates(),origin.balance)
            desiny.extrat.push({transferRec:transfer, saldo: desiny.balance})
            origin.extrat.push({transferFet:transfer, saldo: origin.balance})
            

            const response1 = await fetch(`http://localhost:3000/Accounts/${origin.id}`,{
                method: 'PUT',
                headers: {'content-Type':'application/json'},
                body: JSON.stringify(origin)
            })
            const response2 = await fetch(`http://localhost:3000/Accounts/${desiny.id}`,{
                method: 'PUT',
                headers: {'content-Type': 'application/json'},
                body:JSON.stringify(desiny)
            })
            await App.reloadUsers()
        } else {
            alert('Seu saldo é insuficiente.')
        }
    }
    static returnExtrat(id){
       
        const iuser = this.#users.map(o=>o.id).indexOf(id)
        const user = this.#users[iuser]
         console.log(user)
        return user.extrat
    }
}
