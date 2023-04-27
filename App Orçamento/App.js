class Despesas{

    constructor(ano, mes, dia, tipo, descricao, valor){
        
        this.ano = ano
        this.mes = mes 
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    // Método para validação dos dados
    Validardados(){

        // O this aqui está fazendo refêrencia para os atributos de Despesas, nesse momento vamos percorrer cada um dos elementos 
        // contido dentro dos atributos Despesas
        for(let i in this){
            
            // todos os elementos precisam ser preenchidos para não retorna false
            if (this[i] === undefined || this[i] === '' || this[i] === null){
                return false
            }
        }  
        return true
    }

}




class Banco{

    constructor(){
        let id = localStorage.getItem('id')
        
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    // Recuperando a informação contida na chave id 
    getProximoId(){
        let proximoID = localStorage.getItem('id') 

        return parseInt(proximoID) + 1
    }

    gravar(DESPESAS){

        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(DESPESAS)) 

        // Aqui estamos selecionando a chave e sempre atualizando o seu valor, ou seja, selecionamos o id e estamos sempre atribuindo um novo 
        // valor ao seu identificador único.
        localStorage.setItem('id', id) 
    }


    // Metodo para recuperar todas as despesas
    recuperarTodosRegistros(){

        let despesas = Array()
        let id = localStorage.getItem('id')
        
        // Recuperando todas as despesas cadastradas em localStorage 
        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }
            
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    //Método para filtrar a pesquisar
    pesquisar(despesa){

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        if(despesa.ano != ''){

            despesasFiltradas = despesasFiltradas.filter(function(desp){
                return desp.ano == despesa.ano
            })
        }

        if(despesa.mes != ''){

            despesasFiltradas = despesasFiltradas.filter(function(desp){
                return desp.mes == despesa.mes
            })
        }

        if(despesa.dia != ''){

            despesasFiltradas = despesasFiltradas.filter(function(desp){
                return desp.dia == despesa.dia
            })
        }

        if(despesa.tipo != ''){

            despesasFiltradas = despesasFiltradas.filter(function(desp){
                return desp.tipo == despesa.tipo
            })
        }

        if(despesa.descricao != ''){

            despesasFiltradas = despesasFiltradas.filter(function(desp){
                return desp.descricao == despesa.descricao
            })
        }

        if(despesa.valor != ''){

            despesasFiltradas = despesasFiltradas.filter(function(desp){
                return desp.valor == despesa.valor
            })
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Banco()




// Pegando os valores dos elementos da página HTML
function cadastrarDespesa(){

    // Seleção de elementos da página pelo id.
    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    // Recuperando valor do elemento com a palavra reservada value
    let despesas = new Despesas(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)


    // Mensagem de exibição para confirmar que os dados foram gravados ou está incompleto
    if(despesas.Validardados()){
        
        // Se todas as despesas forem validas, execute o metodo gravar dados
        bd.gravar(despesas)

        // Selecionando elementos html 
        document.getElementById("TituloModal").innerHTML = "Registro inserido com sucesso"
        document.getElementById("ModalTituloDiv").className = "modal-header text-success"
        document.getElementById("ModalConteudo").innerHTML = "Despesas cadastradas com sucesso"
        document.getElementById("ModalBTN").innerHTML = "Voltar"
        document.getElementById("ModalBTN").className = "btn btn-success"
        $('#modalRegistrarDespesa').modal('show')

        //Limpando os campos
        ano.value = ''
        mes.value =''
        dia.value = ''
        tipo.value = ''
        descricao.value = '' 
        valor.value = ''

    }else{

        // Selecionando elementos html 
        document.getElementById("TituloModal").innerHTML = "Registro inserido com sucesso"
        document.getElementById("ModalTituloDiv").className = "modal-header text-danger"
        document.getElementById("ModalConteudo").innerHTML = "Verifique se todos os campos foram preenchidos corretamente"
        document.getElementById("ModalBTN").innerHTML = "Voltar e corrigir"
        document.getElementById("ModalBTN").className = "btn btn-danger"
        $('#modalRegistrarDespesa').modal('show')
    }
}





// fução para carregar a lista de despesas 
function carregarListaDespesas(){

    let despesas = bd.recuperarTodosRegistros() 
    
    // Selecionando o tbody das tabelas 
    let listaDespesas = document.getElementById("listaDespesas")

    // percorrendo o array despesas, listando cada despesa
    despesas.forEach(function(desp) {
        
        // Criando linhas (tr)
        let linha = listaDespesas.insertRow()
        
        // Criando colunas (td)
        linha.insertCell(0).innerHTML = desp.dia + '/' + desp.mes + '/' + desp.ano 

        // Ajustar o tipo de numero para texto
        switch(desp.tipo){
            case '1' : desp.tipo = "Alimentação"
            break;

            case '2' : desp.tipo = "Educação"
            break;

            case '3' : desp.tipo = "Lazer"
            break;

            case '4' : desp.tipo = "Saúde"
            break;

            case '5' : desp.tipo = "Transporte"
            break;
        }

        linha.insertCell(1).innerHTML = desp.tipo
        linha.insertCell(2).innerHTML = desp.descricao
        linha.insertCell(3).innerHTML = desp.valor

        //Criar botão para deletar
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = "id_despesas" + desp.id
        btn.onclick = function(){

            let id = this.id.replace("id_despesas", "")
            bd.remover(id)
            windows.location.reload
        }

        linha.insertCell(4).append(btn)
        console.log(desp)
       
    });
}


// Método para pesquisar despesas
function pesquisarDespesas(){

    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    let despesa = new Despesas(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    let despesas = bd.pesquisar(despesa)

    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''

    despesas.forEach(function(desp) {
        
        // Criando linhas (tr)
        let linha = listaDespesas.insertRow()
        
        // Criando colunas (td)
        linha.insertCell(0).innerHTML = desp.dia + '/' + desp.mes + '/' + desp.ano 

        // Ajustar o tipo de numero para texto
        switch(desp.tipo){
            case '1' : desp.tipo = "Alimentação"
            break;

            case '2' : desp.tipo = "Educação"
            break;

            case '3' : desp.tipo = "Lazer"
            break;

            case '4' : desp.tipo = "Saúde"
            break;

            case '5' : desp.tipo = "Transporte"
            break;
        }

        linha.insertCell(1).innerHTML = desp.tipo
        linha.insertCell(2).innerHTML = desp.descricao
        linha.insertCell(3).innerHTML = desp.valor



        // Ajustar o tipo de numero para
       
    });

    
}