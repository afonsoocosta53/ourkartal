var express = require('express');
var router = express.Router();
var request = require("request");
var Cart = require('../models/cart');
var sleep = require('sleep');

router.get('/checkout', function(req, res) {
    var id_gerado = req.cookies['id_gerado'];
    var productsCarrinho = null;
    var quantidadeItens = 0;
    if (!req.session.cart) {
        quantidadeItens: null
    }
    else {
        var cart = new Cart(req.session.cart);
        productsCarrinho = cart.generateArray()
        quantidadeItens = cart.quantidade()
        var totalPrice = cart.totalPrice;
    }
    request.get({
        headers: { 'authorization': id_gerado },
        url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo/',
    }, function(error, response, body) {
        var body2 = JSON.parse(body);
        var sucess = body2.success;
        if (sucess == true) {
            var user = body2.user;
            res.render('checkout', {
                productsCarrinho: productsCarrinho,
                quantidadeItens: quantidadeItens,
                totalPrice: totalPrice,
                user: user,
                layout: 'layout2'
            });
        }
        else {
            res.redirect('/user/login');
        }
    });
})

router.post('/transaction', function(req, res) {
    console.log("TRANSACTION")
    var id_gerado = req.cookies['id_gerado'];
    var cart = new Cart(req.session.cart);
    var productsCarrinho = cart.generateArray();
    request.get({
        headers: { 'authorization': id_gerado },
        url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo/',
    }, function(error, response, body) {
        var body2 = JSON.parse(body);
        var sucess = body2.success;
        if (sucess == true) {
            var user = body2.user;
            var compradorAddress = user.addressConta; //USER PARA PAGAR
            var compradorPrivateKey = user.chavePrivada; //USER PARA PAGAR
            request.get({
                url: 'https://blockchain-joaocunha20.c9users.io/definicoesMoeda/definicoesMoeda',
            }, function(error, response, body7) {
                var body8 = JSON.parse(body7);
                var sucess4 = body8.success;
                if (sucess4 == true) {
                    var definicoesMoeda = body8.definicoesMoeda
                    var addressEmpresa = definicoesMoeda['0'].addressEmpresa; //ADDRESS DA NOSSA CONTA
                    var rating0 = definicoesMoeda['0'].rating0;
                    var rating1 = definicoesMoeda['0'].rating1;
                    var rating2 = definicoesMoeda['0'].rating2;
                    var rating3 = definicoesMoeda['0'].rating3;
                    var rating4 = definicoesMoeda['0'].rating4;
                    var rating5 = definicoesMoeda['0'].rating5;
                    var taxa = definicoesMoeda['0'].taxa;
                    productsCarrinho.forEach(function(produto) {
                        var vendedor_id = produto.item.vendedor_id;
                        request.post({
                            headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
                            url: 'https://blockchain-joaocunha20.c9users.io/product/vendedorAddress',
                            body: 'id_vendedor=' + vendedor_id
                        }, function(error, response, body5) {
                            var body3 = JSON.parse(body5);
                            var sucess4 = body3.success;
                            if (sucess4 == true) {
                                var vendedorAddress = body3.address; // ADDRESS PARA TRANSFERIR
                                var vendedorRating = body3.rating; //RATING DO VENDEDOR
                                var preco_produto_sem_taxa = produto.item.preco;
                                var preco_produto = preco_produto_sem_taxa * (1 - taxa);
                                var preco_enviar_vendedor = 0;
                                var preco_enviar_empresa = 0;
                                var preco_atransferir = 0;
                                if (vendedorRating == 0) {
                                    var preco_enviar_vendedor = preco_produto * rating0;
                                    var preco_enviar_empresa = (preco_produto * (1 - rating0)) + (preco_produto_sem_taxa * taxa);
                                    var preco_atransferir = preco_produto * (1 - rating0)
                                }
                                else {}
                                if (vendedorRating == 1) {
                                    var preco_enviar_vendedor = preco_produto * rating1;
                                    var preco_enviar_empresa = (preco_produto * (1 - rating1)) + (preco_produto_sem_taxa * taxa);
                                    var preco_atransferir = preco_produto * (1 - rating1)
                                }
                                else {}
                                if (vendedorRating == 2) {
                                    var preco_enviar_vendedor = preco_produto * rating2;
                                    var preco_enviar_empresa = (preco_produto * (1 - rating2)) + (preco_produto_sem_taxa * taxa);
                                    var preco_atransferir = preco_produto * (1 - rating2)
                                }
                                else {}
                                if (vendedorRating == 3) {
                                    var preco_enviar_vendedor = preco_produto * rating3;
                                    var preco_enviar_empresa = (preco_produto * (1 - rating3)) + (preco_produto_sem_taxa * taxa);
                                    var preco_atransferir = preco_produto * (1 - rating3)
                                }
                                else {}
                                if (vendedorRating == 4) {
                                    var preco_enviar_vendedor = preco_produto * rating4;
                                    var preco_enviar_empresa = (preco_produto * (1 - rating4)) + (preco_produto_sem_taxa * taxa);
                                    var preco_atransferir = preco_produto * (1 - rating4)
                                }
                                else {}
                                if (vendedorRating == 5) {
                                    var preco_enviar_vendedor = preco_produto * rating5;
                                    var preco_enviar_empresa = (preco_produto * (1 - rating5)) + (preco_produto_sem_taxa * taxa);
                                    var preco_atransferir = preco_produto * (1 - rating5)
                                }
                                else {}
                                var bodyOTK = 'quantidade=' + preco_enviar_empresa +
                                    '&&toAddress=' + addressEmpresa + '&&fromAddress=' +
                                    compradorAddress + '&&fromPrivateKey=' + compradorPrivateKey;
                                request.post({
                                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                                    url: 'https://ehter-troublemasters.c9users.io/cripto/transfer',
                                    body: bodyOTK
                                }, function(error, response, body10) {
                                    var body11 = JSON.parse(body10);
                                    var sucess10 = body11.success;
                                    if (sucess10 == true) {
                                        var editPendente = 'id_vendedor=' + produto.item.vendedor_id +
                                            '&&id_produto=' + produto.item.id_produto + '&&valor_transferido=' + preco_produto + '&&valor_atransferir=' + preco_atransferir;
                                        request.post({
                                            headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
                                            url: 'https://blockchain-joaocunha20.c9users.io/product/editProductPendente',
                                            body: editPendente
                                        }, function(error, response, pendenteBody) {
                                            var pendenteBody1 = JSON.parse(pendenteBody);
                                            var pendenteSucess = pendenteBody1.success;
                                            if (pendenteSucess == true) {
                                                var bodyOTK = 'quantidade=' + preco_enviar_vendedor +
                                                    '&&toAddress=' + vendedorAddress + '&&fromAddress=' +
                                                    compradorAddress + '&&fromPrivateKey=' + compradorPrivateKey;
                                                sleep.sleep(10);
                                                console.log("TESTE")
                                                request.post({
                                                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                                                    url: 'https://ehter-troublemasters.c9users.io/cripto/transfer',
                                                    body: bodyOTK
                                                }, function(error, response, body17) {
                                                    var body15 = JSON.parse(body17);
                                                    var sucess12 = body15.success;
                                                    if (sucess12 == true) {
                                                        var editPago = 'id_vendedor=' + produto.item.vendedor_id +
                                                            '&&id_produto=' + produto.item.id_produto;
                                                        request.post({
                                                            headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
                                                            url: 'https://blockchain-joaocunha20.c9users.io/product/editProductPago',
                                                            body: editPago
                                                        }, function(error, response, pagoBody) {
                                                            var pagoBody1 = JSON.parse(pagoBody);
                                                            var pagosucess = pagoBody1.success;
                                                            if (pagosucess == true) {
                                                                cart.clearCart();
                                                                req.session.cart = cart;
                                                                res.redirect('/carrinho');
                                                            }
                                                            else {
                                                                res.redirect('/carrinho');
                                                            }
                                                        })

                                                    }
                                                    else {
                                                        res.redirect('/carrinho');
                                                    }
                                                });
                                            }
                                            else {

                                            }
                                        });
                                    }
                                    else {
                                        res.redirect('/carrinho');
                                    }
                                });
                            }
                            else {
                                res.redirect('/carrinho')
                            }
                        });
                    })
                }
                else {
                    res.redirect('/carrinho');
                }
            });
        }
        else {
            res.redirect('/carrinho');
        }
    });
})
module.exports = router;
