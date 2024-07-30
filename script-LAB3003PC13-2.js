let figClicada = ''
let paresEncontrados = 0

function win() {
    
    if (paresEncontrados == 8) {
    var areaGameWin = document.querySelector(".gamewin")
    areaGameWin.style.display = 'flex'
}
}

//home
document.getElementById("home").addEventListener("click", function voltarMenu() {
    location.reload()
})

// restart
document.getElementById("restart").addEventListener("click", function restart() {
    var areaStart = document.querySelector("#area-inicial")
    var areaGameWin = document.querySelector(".gamewin")

    areaStart.style.display = 'none'
    areaGameWin.style.display = 'none'

    var fig = document.getElementsByClassName('fig')
    for (let i = 0; i<16 ; i++) {
        fig[i].style.order = `${Math.floor(Math.random()*100)}`
    }
})

//startar os elementos de forma aleatoria
document.getElementById("start").addEventListener("click", function start(){
    var areaStart = document.querySelector("#area-inicial")
    areaStart.style.display = 'none'

    var fig = document.getElementsByClassName('fig')
    for (let i = 0; i<16 ; i++) {
        fig[i].style.order = `${Math.floor(Math.random()*100)}`
    }

})

figClicada = false

function comp(valor){
    
    if (!figClicada) {
        let elementoClicado = document.getElementsByClassName("fig")[valor]
        var input1 = document.getElementById("comp")
        var pegarid1 = document.getElementById("valor1")

        input1.value = elementoClicado.classList

        pegarid1.value = elementoClicado.id


        elementoClicado.style.animation = 'girar 1s'
        elementoClicado.classList.add("virada")

        

        for (let i = 0; i<16 ; i++) {
            document.getElementsByClassName("fig")[i].setAttribute("onclick", `comp2(${i})`)
        }

        figClicada = true
        destaque()
    } 

}

function comp2(valor){
    if (figClicada === true) { // se for true

        let elementoClicado = document.getElementsByClassName("fig")[valor]
        var pegarid1 = document.getElementById("valor1")
        var pegarid2 = document.getElementById("valor2")
        
        var input1 = document.getElementById("comp")
        var input2 = document.getElementById("comp2")
        
        input2.value = elementoClicado.classList
        pegarid2.value = elementoClicado.id
        
        elementoClicado.style.animation = 'girar 1s'
        elementoClicado.classList.add("virada")

        figClicada = false
        compFinal()
        pegarid1.value = ''
        pegarid2.value = ''
        input1.value = ''
        input2.value = ''
        destaque()
    } 
}

function compFinal() {
    let valorInput1 = document.getElementById("comp").value
    let valorInput2 = document.getElementById("comp2").value
    let valorInputId1 = document.getElementById("valor1").value
    let valorInputId2 = document.getElementById("valor2").value

    for (let i = 0; i<16 ; i++) {
        document.getElementsByClassName("fig")[i].setAttribute("onclick", `comp(${i})`)
    }

    if (valorInput1 == valorInput2) {
        let elementoClicado1 = document.getElementById(`${valorInputId1}`)
        let elementoClicado2 = document.getElementById(`${valorInputId2}`)

        elementoClicado1.classList.add("destaque")
        elementoClicado2.classList.add("destaque")

        elementoClicado1.addEventListener("click", function clicado(){
            alert("elemento já clicado")
        })
        elementoClicado2.addEventListener("click", function clicado2(){
            alert("elemento já clicado")
        })

        //pares encontrados
        paresEncontrados++
        document.getElementById("paresCounter").innerHTML = paresEncontrados
        
        win()
    } else { // se não forem iguais
        let elementoClicado1 = document.getElementById(`${valorInputId1}`)
        let elementoClicado2 = document.getElementById(`${valorInputId2}`)
        for (let i = 0; i<16 ; i++) {
            document.getElementsByClassName("fig")[i].setAttribute("onclick", `comp(${i})`)
        }

        setTimeout(function naoIgual() {elementoClicado1.style.animation = 'voltar 1s'
        elementoClicado1.classList.remove("virada")
        elementoClicado2.style.animation = 'voltar 1s'
        elementoClicado2.classList.remove("virada")}, 1000)
        destaque()
    }  
}



function destaque() {
    for (let i = 0; i<16 ; i++) {
        document.getElementsByClassName("destaque")[i].setAttribute("onclick", `destaque()`)
    }
}










