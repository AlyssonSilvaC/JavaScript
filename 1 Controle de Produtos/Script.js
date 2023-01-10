/*
Estamos Basicamente criando um crud, mas sem o Banco de dados.
Vamos utilizar o nosso array como se fosse o banco de dados.

Iremos ler os dados, salvar e adicionar (parte 1)

lista os dados na tabela, validar os campos (parte 2)

cancelar, deletar, editar e atualizar (parte 3)

Estamos basicamente criando um crud (Crud Basico Sem  Banco de dados)
*/

class Produto {

    constructor(){
        this.id = 1
        this.arrayProdutos = []
        this.editId = null
    }

    // Aqui estamos lendo os produtos 
    lerDados(){ 
        
        let produto = {}

        produto.id = this.id
        produto.nomeProduto = document.getElementById('produto').value
        produto.preco = document.getElementById('preco').value

        return produto
    }

    // Adicionando os produtos no array
    adicionar(produto){
        produto.preco = parseFloat(produto.preco)
        this.arrayProdutos.push(produto)
        this.id++
    }

    salvar(){ // Estamos salvando os produtos no array

        let produto = this.lerDados()

        if(this.validarCampos(produto) == true){
            if(this.editId == null){
                this.adicionar(produto)
            }else{
                this.atualizar(this.editId, produto)
            }
            
        }

        this.listaTabela() // Listando as tabelas na tela
        this.cancelar() // Limpar os produtos apos adicionados
        
    }



    







    // Manipulando tabelas utilizando InsertRown para criar as linhaa da tabela, insertCell para criar as colunas
    listaTabela(){ 
        let tbody = document.getElementById('tbody')
        tbody.innerHTML = ''

        for(let i = 0; i < this.arrayProdutos.length; i++){

            // Cria uma nova linha dentro da nossa tabela
            let tr = tbody.insertRow()

            let td_id = tr.insertCell()
            let td_produto = tr.insertCell()
            let td_valor = tr.insertCell()
            let td_acao = tr.insertCell()

            td_id.innerHTML = this.arrayProdutos[i].id
            td_produto.innerHTML = this.arrayProdutos[i].nomeProduto
            td_valor.innerHTML = this.arrayProdutos[i].preco
            

            let imgEdit = document.createElement('img')
            let imgDelete = document.createElement('img')

            imgEdit.src = 'img/editar.png'
            imgDelete.src = 'img/lixeira.png'

            imgDelete.setAttribute('onclick',"produto.deletar(" +this.arrayProdutos[i].id+ " )") // Estamo passando o id
            imgEdit.setAttribute('onclick',"produto.editar(" + JSON.stringify(this.arrayProdutos[i])+ " )") 

            td_acao.appendChild(imgDelete)
            td_acao.appendChild(imgEdit)
        }
    }

    // Verificando se os campos não estão vazios
    validarCampos(produto){
        let mensagem = ''
        if(produto.nomeProduto == ''){
            mensagem += 'Informe o nome do produto'
        }

        if(produto.preco == ''){
            mensagem += 'Informe o preço do produto'
        }

        if(mensagem != ''){
            alert(mensagem)
            return false
        }

        return true
    }










    // Cancelar os campos e Limpando
    cancelar(){ 
        document.getElementById('produto').value = ''
        document.getElementById('preco').value = ''

        document.getElementById('atualizar').innerText = 'Salvar'
        this.editId = null
    }


    // Acessando o array e removendo o item
    deletar(id){ 
        
        let tbody = document.getElementById('tbody')

        for(let i = 0; i < this.arrayProdutos.length; i++){
            if(this.arrayProdutos[i].id == id){
                this.arrayProdutos.splice(i, 1)
                tbody.deleteRow(i)
            }
            
        }

    }


    editar(dados){ // Editando item No array

        this.editId = dados.id

        document.getElementById('produto').value = dados.nomeProduto
        document.getElementById('preco').value = dados.preco
        
        document.getElementById('atualizar').innerText = 'atualizar'
    }

    atualizar(id, produto){ // Atualizando item no Array

        for(let i = 0; i < this.arrayProdutos.length; i++){
            if(this.arrayProdutos[i].id == id){
                
                this.arrayProdutos[i].nomeProduto = produto.nomeProduto
                this.arrayProdutos[i].preco = produto.preco
            }
        }
    }

}

var produto = new Produto