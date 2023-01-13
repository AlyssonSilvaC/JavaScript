let seuVotoPara = document.querySelector('.divisao-1-1 span')
let cargo = document.querySelector('.divisao-1-2 span')
let descricao = document.querySelector('.divisao-1-4')

let aviso = document.querySelector('.divisao-2')
let lateral = document.querySelector('.divisao-1-direita')
let numero = document.querySelector('.divisao-1-3')

let etapaAtual = 0
let numeros = ''
let votoBranco = false
let votos = []

// Limpar a tela e pega as informações da etapaAtual
function comecarEtapa(){

    let etapa = etapas[etapaAtual]
    let numeroHtml = ''
    numeros = ''
    votoBranco = false
    
    // quadrados na tela piscando
    for(let i = 0; i < etapa.numeros; i++){
        if(i === 0){
            numeroHtml += '<div class="numeros pisca"></div>';
        }else{
            numeroHtml += '<div class="numeros"></div>';
        }
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numero.innerHTML = numeroHtml
}


function atualizarInterface(){
    let etapa = etapas[etapaAtual]

    let candidato = etapa.candidatos.filter( function(item){
        if(item.numero === numeros){
            return true
        }else{
            return false
        }
    });

    if(candidato.length > 0){
        
        candidato = candidato[0]
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`

        let fotoshtml = '';
        for(let i in candidato.fotos){
            
            if(candidato.fotos[i].small){
                fotoshtml += `<div class="divisao-1-image small"><img src="images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`
            }else{
                fotoshtml += `<div class="divisao-1-image"><img src="images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`
            }
            
        }

        lateral.innerHTML = fotoshtml

    }else{
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO<div/>'
    }
}


function clicou(n){
    let Elnumero = document.querySelector('.numeros.pisca')

    if(Elnumero !== null){
        Elnumero.innerHTML = n
        numeros = `${numeros}${n}`
        Elnumero.classList.remove('pisca')
        
        if(Elnumero.nextElementSibling !== null){
            Elnumero.nextElementSibling.classList.add('pisca') // Ele acha o elemento que está ao seu lado
        }else{
            atualizarInterface()
        }
        
    }
}



function branco(){
    if(numeros === ''){
        votoBranco = true
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        numero.innerHTML = ''
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO<div/>'
    }
}


function corrigir(){
    comecarEtapa()
}


function confirmar(){
    
    let etapa = etapas[etapaAtual]
    let votoConfirmado = false

    if(votoBranco === true){
        
        votoConfirmado = true
        console.log('Confirmando voto branco')
            votos.push({
                etapa: etapas[etapaAtual].titulo,
                voto: 'branco'
            })

    }else if(numeros.length === etapa.numeros){

        votoConfirmado = true
        console.log('Confirmando:'+ numeros)
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numeros
        })
    }

    // sendo direcionado para etapa do prefeito
    if(votoConfirmado){
        etapaAtual++
        if(etapas[etapaAtual] !== undefined){
            comecarEtapa()
        }else{
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM<div/>'
            console.log(votos)
        }
    }
}

comecarEtapa()


