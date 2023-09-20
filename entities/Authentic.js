export function authentcParams(password1,password2,email) { 
    if (password1 !== password2){
        return alert('As senhas devem ser iguais.')
    } else if(
        password1.length < 8||
        !password1.match(/\d/)||
        !password1.match(/[a-z]/)||
        !password1.match(/[A-Z]/)||
        !password1.match(/[^a-zA-Z\s0-9]/)){
            return alert(`A senha deve atender aos requisitos:\n
            Ter pelo menos 8 caracteres;\n
            Ter letras maiúsculas e minúsculas;
            Ter pelo menos um caractere especial (#-=+*..).`)
        } else if (!email.match(/\w{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,}/)) {
            return alert('Email invalido!')
        } else {
            return true
        }
}