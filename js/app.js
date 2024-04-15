//depois de pronto, executa a função generalista abaixo
$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio= {};

var MEU_CARRINHO = [];

var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

cardapio.eventos= {

    //quando inicializar a tela
    init: () => {
        console.log('Iniciou');

        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {

    //pega itens do cardapio por filtragem - inicial com burgers
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];

        if(!vermais){
            $("#itensCardapio").html('');
        }

        //e = elemento
        $.each(filtro, (i,e) => {

            //carrega template de item + regex no replace
            let temp = cardapio.templates.item.replace(/\${img}/g,e.img)
            .replace(/\${nome}/g,e.name)
            .replace(/\${preco}/g,e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g,e.id);

            //validando se clicou no ver mais e exibir os 4 ultimos itens - 12 itens
            if(vermais && i >= 8 && i< 12){
                $("#itensCardapio").append(temp);
            }

            //mostrar os itens iniciais
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp);
            }

        })

        //remover classe active e hidden
        $(".container-menu a").removeClass('active');
        $("#btnVerMais").removeClass("hidden");

        //adicionar classe active para categoria clicada
        $("#menu-"+categoria).addClass("active");
        
    },

    //clique no botão de ver mais
    verMais: () => {

        //descobrir qual categoria está ativa antes de mostrar mais
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]//split para remover o menu- e retornar somente a categoria;

        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass("hidden");
    },

    //diminuir quantidade do item no cardapio
    diminuirQuantidade: (id) => {
        //pega quantidade do item
        let qntdAtual = parseInt($("#qntd-"+id).text());

        if(qntdAtual > 0){
            $("#qntd-"+id).text(qntdAtual-1);
        }
    },

    //aumentar quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        //pega quantidade do item
        let qntdAtual = parseInt($("#qntd-"+id).text());
        $("#qntd-"+id).text(qntdAtual+1);
    },

    //adicionar item ao carrinho
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-"+id).text());

        if(qntdAtual > 0){

            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1]//split para remover o menu- e retornar somente a categoria;

            //obter lista de items
            let filtro = MENU[categoria];

            //pegar o item
            let item = $.grep(filtro, (e,i) => {
                return e.id == id
            });

            //verificar se existe o item
            if(item.length > 0){

                //validar se ja existe item, antes de adicionar ou remover do carrinho
                let existe = $.grep(MEU_CARRINHO, (elem,index) => {
                    return elem.id == id
                });

                //caso já exista, só altera a quantidade, senão adiciona o item
                if(existe.length > 0){
                    //pega objeto em questão
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd += qntdAtual;
                }else{
                    //pega quantidade de itens para adicionar no carrinho via push juntamente com o elemento "quantidade" no objeto
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }

                cardapio.metodos.mensagem('Item Adicionado no Carrinho','green','5000');
                //volta qntd para zero
                $("#qntd-"+id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }
        }
    },

    //atualizar valores da badge de carrinho
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        //valida se tem algo no carrinho, se tiver mostra, senao remove
        if(total > 0){
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }else{
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }
        //adiciona o total a div
        $(".badge-total-carrinho").html(total);

    },

    //Abrir a modal de carrinho e produtos
    abrirCarrinho: (abrir) => {

        if(abrir){
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }else{
            $("#modalCarrinho").addClass('hidden');

        }

    },

    //altera os textos e exibe botões de proximas etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1){
            //alterando titulo da etapa
            $("#lblTituloEtapa").text("Seu Carrinho:");
            //mostrando etapa
            $("#itensCarrinho").removeClass("hidden");
            //escondendo demais etapas
            $("#localEntrega").addClass("hidden");
            $("#resumoCarrinho").addClass("hidden");
            //alterando icones de etapa
            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            //alterando botões
            $("#btnEtapaPedido").removeClass("hidden");
            $("#btnEtapaEndereco").addClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnVoltar").addClass("hidden");
        }

        if(etapa == 2){
            $("#lblTituloEtapa").text("Endereço de Entrega:");
            $("#itensCarrinho").addClass("hidden");
            $("#localEntrega").removeClass("hidden");
            $("#resumoCarrinho").addClass("hidden");
            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");
            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").removeClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnVoltar").removeClass("hidden");
        }

        if(etapa == 3){
            $("#lblTituloEtapa").text("Resumo do Pedido:");
            $("#itensCarrinho").addClass("hidden");
            $("#localEntrega").addClass("hidden");
            $("#resumoCarrinho").removeClass("hidden");
            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");
            $(".etapa3").addClass("active");
            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").addClass("hidden");
            $("#btnEtapaResumo").removeClass("hidden");
            $("#btnVoltar").removeClass("hidden");
        }

    },

    //volta uma etapa
    voltarEtapa: () => {

        //pega o tamanho de etapas com classe active. Cada classe ativa conta um
        let etapa = $(".etapa.active").length;

        //pega a etapa e volta uma.
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    //carrega a lista de itens dos carrinho
    carregarCarrinho: () => {
        //inicia a etapa inicial
        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length > 0){
            //limpa antes de carregar
            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g,e.img)
                .replace(/\${nome}/g,e.name)
                .replace(/\${preco}/g,e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g,e.id)
                .replace(/\${qntd}/g,e.qntd);

                $("#itensCarrinho").append(temp);

                //ultimo item do carrinho, atualiza valores...
                if((i + 1) == MEU_CARRINHO.length){
                    cardapio.metodos.carregarValores();
                }
            })
        }else{
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio!</p>');
            cardapio.metodos.carregarValores();
        }
    },

    //diminui a quantidade de itens na lista do carrinho
    diminuirQuantidadeCarrinho: (id) =>{

        //pega a quantidade do item no carrinho
        let qntdAtual = parseInt($("#qntd-carrinho-"+id).text());

        //se for maior que um diminui, senao exclui da lista
        if(qntdAtual > 1){
            //atualiza a quantidade atual
            $("#qntd-carrinho-"+id).text(qntdAtual-1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }else{
            //remove item do carrinho
            cardapio.metodos.removerItemCarrinho(id);
        }
    },

    //aumenta a quantidade de itens na lista do carrinho
    aumentarQuantidadeCarrinho: (id) =>{
        //pega a quantidade do item no carrinho
        let qntdAtual = parseInt($("#qntd-carrinho-"+id).text());
        //adiciona item no carrinho
        $("#qntd-carrinho-"+id).text(qntdAtual+1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },

    //remove o item do carrinho quando zerar quantidade ou quando clicar no X
    removerItemCarrinho: (id) => {

        //filtra itens do carrinho
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) =>{
            //retorna lista de itens que não tem o id passado, ou seja, remove somente o id passado.
            return e.id != id;
        })

        //carrega novamente o carrinho atualizado
        cardapio.metodos.carregarCarrinho();
        //atuializa badge novamente
        cardapio.metodos.atualizarBadgeTotal();
    },

    //atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        //pega o obj que está sendo falado, por meio do ID e atualiza a quantidade dele no carrinho
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza na home o botão de shopping com qntd total atual e valor do pedido
        cardapio.metodos.atualizarBadgeTotal();
        cardapio.metodos.carregarValores();
    },

    //carrega os valores a depender dos itens do carrinho...
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        //redefine os valores
        $("#lblSubTotal").text("R$ 0,00");
        $("#lblValorEntrega").text("+ R$ 0,00");
        $("#lblValorTotal").text("R$ 0,00");

        //percorre itens pra pegar valores
        $.each(MEU_CARRINHO, (i,e) => {
            //converte o valor pra float e coloca no valor do carrinho depois de multiplicar o valor dos itens pela quantidade
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            //valida se é o ultimo item do carrinho... Se index atual for igual ao tamanho do carrinho é pq é o ultimo...
            if((i + 1) == MEU_CARRINHO.length){
                //dando toFixed e replace para colocar mascara de reais
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO+VALOR_ENTREGA).toFixed(2).replace('.',',')}`);
            }
        })

    },

    //carrega endereço via api
    carregarEndereco: () => {

        if(MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem('Seu carrinho está vazio!')
            return;
        }



        cardapio.metodos.carregarEtapa(2);
    },

    //chama api viacep
    buscarCep: () => {

        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        if(cep != ""){

            //expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)){

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if(!("erro" in dados)){
                        // Atualizar campos com dados recebidos pela api

                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);

                        $("#txtNumero").focus();


                    }else{
                        cardapio.metodos.mensagem("CEP não encontrado. Preencha as informações manualmente!")
                        $("#txtEndereco").focus();
                    }

                })

            }else{
                cardapio.metodos.mensagem("Formato do CEP inválido.")
                $("#txtCEP").focus();
            }
        }else{
            cardapio.metodos.mensagem("Informe o CEP, por favor.");
            $("#txtCEP").focus();
        }
    },

    //validação antes de proseguir para pagamento
    resumoPedido: () => {
                   
        let cep = $("#txtEndereco").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if(cep.length <= 0) {
            cardapio.metodos.mensagem("Informe o CEP, por favor.")
            $("#txtCEP").focus();
            return;
        }

        if(endereco.length <= 0) {
            cardapio.metodos.mensagem("Informe o Endereço, por favor.")
            $("#txtEndereco").focus();
            return;
        }

        if(bairro.length <= 0) {
            cardapio.metodos.mensagem("Informe o Bairro, por favor.")
            $("#txtBairro").focus();
            return;
        }

        if(cidade.length <= 0) {
            cardapio.metodos.mensagem("Informe a Cidade, por favor.")
            $("#txtCidade").focus();
            return;
        }

        if(uf.length == "-1") {
            cardapio.metodos.mensagem("Informe o Estado (UF), por favor.")
            $("#ddlUf").focus();
            return;
        }

        if(numero.length <= 0) {
            cardapio.metodos.mensagem("Informe o Número, por favor.")
            $("#txtNumero").focus();
            return;
        }


        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    //carrega valores na etapa de resumo
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g,e.img)
                .replace(/\${nome}/g,e.name)
                .replace(/\${preco}/g,e.price.toFixed(2).replace('.',','))
                .replace(/\${qntd}/g,e.qntd);

                $("#listaItensResumo").append(temp);
        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);
    },

    //exibir mensagem personalizada
    mensagem: (texto,cor = 'red', tempo = 3500) => {

        //criando ID aleatório de acordo com a data atual
        let id = Math.floor(Date.now() * Math.random()).toString();

        //criando template com classes de animação
        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        //adicionando msg a container
        $("#container-mensagens").append(msg);

        //sumir mensagem apos tempo
        setTimeout(() => {
            //Fazendo animação com fadein e fadeOut
            $("#msg-"+ id).removeClass('fadeInDown');
            $("#msg-"+ id).addClass('fadeOutUp');
            //depois da animação, remove de fato a mensagem da estrutura html
            setTimeout(()=>{
                $("#msg-"+ id).remove();                
            },800);
        },tempo);

    },
}

cardapio.templates = {

    item: `
        <div class="col-3 mb-4">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" >
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}">
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${preco}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `
}