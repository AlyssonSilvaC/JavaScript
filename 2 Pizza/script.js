const Elemento = function element(element){
    // para não ficar escrevendo document.querySelector
    return document.querySelector(element)
}

var modalQt = 1
var cart = []
var modalkey = 0

// Listagem das pizzas (tela inicio)

pizzaJson.map(function(pizza, index){ // O pizzaJson está sendo chamado do arquivo pizzas.js

    // Estamos clonando o models e pizza-item com a função cloneNode
    let pizzaItem = Elemento('.models .pizza-item').cloneNode(true)

    //Estamos pegando o conteudo de (pizzaItem) e adicionando a tela com a função append()
    Elemento('.pizza-area').append(pizzaItem)

    pizzaItem.setAttribute('data-key', index) // Estamos insirindo atributo data-key e seu valor
    
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img // Colocando as imagens de pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name // Colocando Nome
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description // Descrição
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}` // Preço 
    



    // Evento de Clique para abrir o modal

    // Estamos Selecionando a tag <a href=""> e estamos bloqueado a sua ação natural que é de ir para outro link
    pizzaItem.querySelector('a').addEventListener('click', function(e){
        e.preventDefault(); // bloqueado a ação natural de navegação do <a href="">

        Elemento('.pizzaWindowArea').style.opacity = 0

        setTimeout(function(){ // Estamos animando a pizzaWindowArea
            Elemento('.pizzaWindowArea').style.opacity = 1
        }, 100);

        Elemento('.pizzaWindowArea').style.display = 'flex' // exibindo o pizzaWindowArea na tela, apos clicar no +

        
        /*
        target clica no proprio elemento (Inicialmente elemento 'a' linha 22) 
        closest acha o elemento mais proximo que tenha a class no caso pizza-item

        ele esta saindo do elemento 'a' e indo para o elemento 'pizza-item'
         */
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalkey = key
        console.log(pizzaJson[key]) // Conseguimos saber agora qual item foi clicado

        

        Elemento('.pizzaInfo h1').innerHTML = pizzaJson[key].name // Nome da pizza no modal
        Elemento('.pizzaInfo--desc').innerHTML = pizzaJson[key].description // descrição da pizza no modal
        Elemento('.pizzaBig img').src = pizzaJson[key].img // imagem da pizza no modal
        Elemento('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}` // valor no modal
        
        
        
        //Tamanho da pizza no modal
        Elemento('.pizzaInfo--size.selected').classList.remove('selected'); // Removendo a seleção

        document.querySelectorAll('.pizzaInfo--size').forEach(function(size, sizeIndex){
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
            

            // Resentando a seleção, ou seja, sempre que abrir o modals ele vai está macardo no Grande
            if(sizeIndex == 2){ 
                size.classList.add('selected')
            }  
        });

        modalQt = 0 // sempre que abrir o modal de pizza ele vai está 0 agora
        Elemento('.pizzaInfo--qt').innerHTML = modalQt;

        
    });
})





// Evento de fechar o modal
function fecharModal(){ 
    Elemento('.pizzaWindowArea').style.opacity = 0

    setTimeout(function(){
        Elemento('.pizzaWindowArea').style.display = 'none'
    }, 200)
}



document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item){
    item.addEventListener('click', fecharModal)
    
})



// ação de clica no + para add
Elemento('.pizzaInfo--qtmais').addEventListener('click', function(){
    modalQt++
    Elemento('.pizzaInfo--qt').innerHTML = modalQt;
})



// ação de clica no - para diminuir
Elemento('.pizzaInfo--qtmenos').addEventListener('click', function(){

    if(modalQt > 1){
        modalQt--
        Elemento('.pizzaInfo--qt').innerHTML = modalQt;
    }
})



// Selecionando o tamanho da pizza e mudando junto a cor
document.querySelectorAll('.pizzaInfo--size').forEach(function(size, sizeIndex){
    size.addEventListener('click', function(e){

        Elemento('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    }) 
});



// Adicionar ao carrinho
Elemento('.pizzaInfo--addButton').addEventListener('click', function(){
    // Qual a pizza?
    console.log('Pizza:'+modalkey)
    // Qual o tamanho?
    let size = Elemento('.pizzaInfo--size.selected').getAttribute('data-key')
    console.log('Tamanho:'+size)
    //Quantas Pizzas?

    let identificador = pizzaJson[modalkey].id +'@'+size;

    let key = cart.findIndex(function(item){

        if(item.identificador == identificador){
            return true
        }
    })

    if(key > -1){
        cart[key].qt += modalQt

    }else{
        cart.push({
            identificador,
            id: pizzaJson[modalkey].id,
            size,
            qt: modalQt
    
        });
    }

    AtualizarCart() // atualizar o carrinho depois fechar
    fecharModal()
})




function AtualizarCart(){
    if(cart.length > 0){ // Se tiver algum item no carrinho exiba o carrinho na tela
        Elemento('aside').classList.add('show')

        Elemento('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart){
            
            let pizzaItem = pizzaJson.find(function(item){
                if(item.id == cart[i].id){
                    return true
                }
            })

            subtotal += pizzaItem.price * cart[i].qt
            desconto
            
            let cartItem = Elemento('.models .cart--item').cloneNode(true)
            let PizzaSizeName = cart[i].size
            
            switch(cart[i].size){
                case 0:
                    PizzaSizeName = 'P';
                    break;
                case 1: 
                    PizzaSizeName = 'M';
                    break;
                case 2: 
                    PizzaSizeName = 'G'
                    break;
            }   

            let pizzaName = `${pizzaItem.name} (${PizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', function(){
                cart[i].qt++
                AtualizarCart()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', function(){
                if(cart[i].qt > 1){
                    cart[i].qt--
                }else{
                    cart.splice(i, 1);
                }
                AtualizarCart()
            })


            Elemento('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto;
        Elemento('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        Elemento('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        Elemento('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    }else{
        Elemento('aside').classList.remove('show')
        Elemento('aside').style.left = '100vw' // fechando o carrinho
    }

    Elemento('.menu-openner span').innerHTML = cart.length
}

// Eventos no mobile
Elemento('.menu-openner').addEventListener('click', function(){
    if(cart.length > 0){

        Elemento('aside').style.left = '0'
    }

})

Elemento('.menu-closer').addEventListener('click', function(){
    Elemento('aside').style.left = '100vw'
})