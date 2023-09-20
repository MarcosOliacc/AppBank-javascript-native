import { App } from "../entities/App.js";
import { authentcParams } from "../entities/Authentic.js";


App.reloadUsers()
console.log(App.retu())
document.getElementById('startAppBtn').addEventListener('click', (ev)=>{
    document.getElementById('startContent').style.display = 'none'
    document.getElementById('sliderConteiner').style.display = 'block'
    document.getElementById('registerContent').classList.add('formActive')
    document.getElementById('loginContent').classList.remove('formActive')
    
    document.getElementById('upFormBtn1').addEventListener('click', (ev)=>{
        document.getElementById('upFormBtn2').classList.remove('formBtnActive')
        ev.currentTarget.classList.add('formBtnActive')
        document.getElementById('loginContent').classList.remove('formActive')
        document.getElementById('registerContent').classList.add('formActive')
    })
    document.getElementById('upFormBtn2').addEventListener('click', (ev)=>{
        document.getElementById('upFormBtn1').classList.remove('formBtnActive')
        ev.currentTarget.classList.add('formBtnActive')
        document.getElementById('loginContent').classList.add('formActive')
        document.getElementById('registerContent').classList.remove('formActive')
    })
})

document.getElementById('registerBtn').addEventListener('click', ()=>{
    const regisFullName = document.getElementById('regsName').value
    const regisEmail = document.getElementById('regsEmail').value
    const regisPassword = document.getElementById('regsSenha').value
    const password2 = document.getElementById('repitSenha').value

    
if(authentcParams(regisPassword,password2,regisEmail) === true){
    const newAccount = App.createAccount(regisFullName,regisEmail,regisPassword)
    if(newAccount === 2) {
        alert("Conta cadastrada com sucesso!!")
        document.getElementById('registerForm').reset()        
    }
}
App.reloadUsers()
console.log(App.retu())
    //const registForm = document.getElementById('registerForm')
})

document.getElementById('loginBtn').addEventListener('click', ()=>{
    const logEmail = document.getElementById('logEmail').value
    const logPassword = document.getElementById('logSenha').value
    const indexUser = App.enterAccount(logEmail,logPassword)

    if(typeof(indexUser)==='number'){
        addEvents(indexUser + 1) 
    }
})




function upBalance(value){
    const balanceContent = document.getElementById('balanceAcc')    
    balanceContent.textContent = Number(value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}
async function addEvents(i) {
    const main1 = document.getElementById('main1')
    const main2 = document.getElementById('idmain2')
    const acc = document.getElementById('accc')
    main1.classList.remove('mainAct'); main2.classList.add('mainAct')

    const contentName = document.getElementById('ownerName')
    const response = await fetch(`http://localhost:3000/Accounts/${i}`).then(res=>res.json())
    acc.textContent = response.account
    contentName.textContent = response.fullName.split(' ')[0]
    upBalance(response.balance)

    document.getElementById('actDeposit').addEventListener('click', function(){
        eventDeposit(response)
    })
    document.getElementById('actTransfer').addEventListener('click', function(){
        eventTransfer(response)
    })
    document.getElementById('actExtrat').addEventListener('click',function(){
        eventExtrat(response)
    })
    document.getElementById('actExit').addEventListener('click',function(){
        main1.classList.add('mainAct'); main2.classList.remove('mainAct')
        document.getElementById('startContent').style.display = 'block'
        document.getElementById('sliderConteiner').style.display = 'none'
        document.getElementById('loginContent').classList.add('formActive')
        document.getElementById('registerContent').classList.add('formActive')
        document.getElementById('form1').reset()
        document.getElementById('registerForm').reset()
    })
}
async function closeArea(id) {
    document.querySelectorAll('.actAreas').forEach(function(ell){ell.classList.remove('mainAct')})
    document.getElementById('depValue').value = ''

    const response = await fetch(`http://localhost:3000/Accounts/${id}`).then(res=>res.json())
    upBalance(response.balance)
}
function eventDeposit(account) {
    document.getElementById('depositArea').classList.add('mainAct')
    
    document.getElementById('confirmDep').addEventListener('click', async function fn(){
        const amount = document.getElementById('depValue').value
        console.log(amount)
        if (amount < 1) {
            alert('Preencha com um valor válido.')
        }else {
            await App.newDeposit(amount,account.id)
            await closeArea(account.id)
            document.getElementById('confirmDep').removeEventListener('click',fn)
        }
    })
    document.getElementById('cancelDep').addEventListener('click', ()=>{
        closeArea(account.id)
    })
}
function eventTransfer(account){
    document.getElementById('TransferArea').classList.add('mainAct')

    document.getElementById('confirmTransf').addEventListener('click', async function fnt(){
        const amount = document.getElementById('transfValue').value
        const destiny = document.getElementById('destiny').value

        if(amount < 1||destiny.length < 4|| destiny < 0) {
            alert('Preencha com um valor válido.')
        }else {
            await App.newTransfer(amount,account.id,destiny)
            await closeArea(account.id)
            document.getElementById('confirmTransf').removeEventListener('click', fnt)
        }
    })
    document.getElementById('cancelTransf').addEventListener('click', ()=>{
        closeArea(account.id)
    })
}
function eventExtrat(acc) {
    document.getElementById('extratArea').classList.add('mainAct')

    const extrat = App.returnExtrat(acc.id)
    const conteiner = document.getElementById('divextrat')
    console.log(extrat)
    for(let i = 0;i<extrat.length;i++){
        const title = document.createElement('h3')
        let parag = ''
        console.log(extrat[i])
        const amount = extrat[i].saldo

        if(extrat[i].transferFet){
            const value = Number(extrat[i].transferFet.value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            parag = `Transfência realizada no valor de ${value}\n
            Destinado à ${extrat[i].transferFet.destiny},\n
            Saldo atual: ${amount}, Data: ${extrat[i].transferFet.date}.`

        } else if (extrat[i].transferRec){
            const value = Number(extrat[i].transferRec.value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

            parag = `Transfência recebida no valor de ${value}\n
            Feita de ${extrat[i].transferRec.origin},\n
            Saldo atual: ${amount}, Data: ${extrat[i].transferRec.date}. `            
        }else if(extrat[i].deposit) {
            const value = Number(extrat[i].deposit.value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

            parag = `Deposito realizado no valor de ${value}\n
            Saldo atual: ${amount}, Data ${extrat[i].deposit.date}.`
        }
        title.textContent = parag
        conteiner.append(title)
    }
    document.getElementById('closeExtrat').addEventListener('click', ()=>{
        document.getElementById('divextrat').innerText = ''
        document.getElementById('extratArea').classList.remove('mainAct')
    })
}

