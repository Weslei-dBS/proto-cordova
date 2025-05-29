var localCarrinho = localStorage.getItem('carrinho');

if (localCarrinho) {
    var carrinho = JSON.parse(localCarrinho);
    if (carrinho.length > 0) {
        //Se houver itens no carrinho renderizar
        renderizarCarrinho();

        //Somar totais
        calcularTotal();

    } else {
        //Se não, mostrar carrinho vazio.
        carrinhoVazio();
    }
} else {
    //mostrar carrinho vazio
    carrinhoVazio();
}

function renderizarCarrinho() {

    //Esvaziar a área dos itens
    $("#listaCarrinho").empty();

    //Percorrer e alimentar
    $.each(carrinho, function (index, itemCarrinho) 
    {
        var itemDiv = `
            <div class="item-carrinho" data-index="${index}">
                <div class="area-img">
                    <img src="${itemCarrinho.item.imagem}">
                </div>
                <div class="area-details">
                    <div class="sup">
                        <span class="name-prod">
                            ${itemCarrinho.item.nome}
                        </span>
                        <a data-index="${index}" class="delete-item" href="#">
                            <i class="mdi mdi-close"></i>
                        </a>
                    </div>
                    <div class="mid">
                        <span>${itemCarrinho.item.principal_caracteristica}</span>
                    </div>
                    <div class="botm">
                        <span>${itemCarrinho.item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <div class="count">
                            <a class="minus" data-index="${index}" href="#">-</a>
                            <input readonly class="qtd-item" type="text" value="${itemCarrinho.quantidade}">
                            <a class="plus" data-index="${index}" href="#">+</a>
                        </div>
                    </div>
                </div>
            </div>                        
        `;

        $("#listaCarrinho").append(itemDiv);
    })

    $(".delete-item").on('click', function (){
        var index = $(this).data('index');

        //Confirmação de exclusão
        app.dialog.confirm('Tem certeza que quer remover este item?', 'Remover', function(){
    
            //Remover o item do carrinho
            carrinho.splice(index, 1);
            
            //Atualizar o carrinho com item removido
            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            //Atualizar a página
            app.views.main.router.refreshPage();
        });
    });

    $(".minus").on('click', function (){
        var index = $(this).data('index');

        //Pelo menos 1 item
        if(carrinho[index].quantidade >1){

            carrinho[index].quantidade--;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            app.views.main.router.refreshPage();

        }else {

            var itemname = carrinho[index].item.nome;
            app.dialog.confirm(`Gostaria de remover <strong>${itemname}</strong>?`, 'REMOVER', function(){
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
                calcularTotal();
            });

        }
        

    });   
    
    $(".plus").on('click', function (){
        var index = $(this).data('index');
        
        carrinho[index].quantidade++;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        calcularTotal();
    });   
}

function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function (index, itemCarrinho){
        totalCarrinho += itemCarrinho.total_item;
    });

    //Mostrar o total
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
}

function carrinhoVazio() {
    console.log('Carrinho está vazio');
    //esvaziar lista de produtos
    $("#listaCarrinho").empty();

    //ocultar botões e totais do tabbar
    $("#tabTotais").addClass('display-none');
    $("#tabCheckout").addClass('display-none');

    //mostrar sacola vazia
    $("#listaCarrinho").html(`
        <div class="text-align-center">
            <img width="300" src="img/empty.gif">
            <br><span class="color-gray">Nada por enquanto...</br>
        </div>       
    `);

}

$("#esvaziar").on('click', function () {
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', 'ESVAZIAR CARRINHO', function () {
        //Apagar o localstorage do carrinho
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();
    })
})

