//startar os elementos de forma aleatoria
let figClicada = ''
document.getElementById("start").addEventListener("click", function start(){
    var areaStart = document.querySelector("#area-inicial")
    
    areaStart.style.display = 'none'
    
    setTimeout(function embaralhar(){var fig = document.getElementsByClassName('fig')
    for (let i = 0; i<16 ; i++) {
        fig[i].style.order = `${Math.floor(Math.random()*100)}`
    }
}, 0)
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
        var verso2 = document.querySelector(`#card-back${valor + 1}`)
        
        elementoClicado.style.animation = 'girar 1s'
        elementoClicado.classList.add("virada")

        figClicada = false
        compFinal()
        pegarid1.value = ''
        pegarid2.value = ''
        input1.value = ''
        input2.value = ''
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

        elementoClicado1.addEventListener("click", function clicado(){
            alert("elemento já clicado")
        })
        elementoClicado2.addEventListener("click", function clicado2(){
            alert("elemento já clicado")
        })
    } else { // se não forem iguais
        let elementoClicado1 = document.getElementById(`${valorInputId1}`)
        let elementoClicado2 = document.getElementById(`${valorInputId2}`)
        for (let i = 0; i<16 ; i++) {
            document.getElementsByClassName("fig")[i].setAttribute("onclick", `comp(${i})`)
        }

        setTimeout(function naoIgual() {elementoClicado1.style.animation = 'voltar 1s'
        elementoClicado1.classList.remove("virada")

        elementoClicado2.style.animation = 'voltar 1s'
        elementoClicado2.classList.remove("virada")}, 800)
    }  
}














