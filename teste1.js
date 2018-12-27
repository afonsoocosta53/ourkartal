comprimento = 10;
largura = 2;

retangulo(comprimento, largura)

function retangulo(comprimento, largura) {
    linha1(comprimento);
    i = 0;
    while (i < largura) {
        i = i + 1
        linhameio(comprimento)
    }
    linha1(comprimento)
};

function linha1(comprimento) {
    lista = "";
    i = 0;
    while (i < comprimento) {
        i = i + 1;
        lista = lista + "-"
    }
    lista2 = "+" + lista + "+"
    console.log(lista2)
};

function linhameio(comprimento) {
    lista = "";
    i = 0;
    while (i < comprimento) {
        i = i + 1;
        lista = lista + " "
    }
    lista2 = "!" + lista + "!"
    console.log(lista2)
}

