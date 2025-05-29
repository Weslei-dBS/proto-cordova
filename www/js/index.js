fetch('js/backend.json')
    .then(response => response.json())
    .then(data => {
        //Salvar os dados vindos do back-end localmente
        //Utilizar LocalStorage
        localStorage.setItem('produtos', JSON.stringify(data));
        console.log('Dados dos produtos salvos no localStorage');
        
        //Simular carregamento
        setTimeout(() => {
            
            //Esvaziar a área de produtos
            $("#produtos").empty();

            //Injection produtos
            data.forEach(produto => {
                var produtoHTML = `
                    <div class="item-card">
                        <a data-id="${produto.id}" href="/#/" class="item">
                            <div class="img-container">
                                <img src="${produto.imagem}">
                            </div>
                            <div class="nome-rating">
                                <span class="color-gray">${produto.nome}</span>
                                <span class="bold margin-right">
                                    <i class="mdi mdi-star"></i>
                                        ${produto.rating}
                                    </span>
                            </div>
                            <div class="price">
                                ${produto.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </a>
                    </div>
                `;

                $("#produtos").append(produtoHTML);

            });

            $(".item").on('click', function () {
                var id = $(this).attr('data-id');
                localStorage.setItem('detalhe', id);
                app.views.main.router.navigate('/detalhes/');
            })

        }, 1000);

    })
    .catch(error => console.error('Erro ao fazer fectch dos dados: ' + error));

    //Visualizar Itens no carrinho
    setTimeout(() => {  
        var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        //Alimentar o contador da sacola
        $('.btn-cart').attr('data-count', carrinho.length);
    
    }, 300);