var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var speakeasy = require('speakeasy');
var bcrypt = require('bcryptjs');
var dateTime = require('node-datetime');
var ip = require("ip");
var http = require('http');
var request = require("request");
var parser = require('json-parser');
var breadcrumb = require('express-url-breadcrumb');
var Cart = require('../models/cart');

router.get('/:id_produto', breadcrumb(), function(req, res) {
    var id_produto = req.params.id_produto;
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
    if (id_gerado === null || id_gerado === undefined) {
        request.get({
            headers: { 'authorization': id_gerado },
            url: 'https://blockchain-joaocunha20.c9users.io/product/productInfo/' + id_produto,
        }, function(error, response, body) {
            var body2 = JSON.parse(body);
            var sucess = body2.success;
            if (sucess == true) {
                var product = body2.productinfo;
                var vendedor = body2.vendedor;
                var feedback = body2.feedback;
                var rating = vendedor.rating;
                var imagens = product.imagem;
                var produtos4 = body2.produtos4;
                var contaCriada = body2.vendedor.accCreatedOn;
                var d = new Date(contaCriada);
                var anoConta = d.getFullYear();
                res.render('product', {
                    layout: 'product',
                    productinfo: product,
                    vendedor: vendedor,
                    feedback: feedback,
                    anoConta: anoConta,
                    rating: rating,
                    imagens: imagens,
                    produtos4: produtos4,
                    productsCarrinho: productsCarrinho,
                    quantidadeItens: quantidadeItens,
                    totalPrice: totalPrice
                });
            }
            else {
                res.render('product', {
                    layout: 'product',
                    productsCarrinho: productsCarrinho,
                    quantidadeItens: quantidadeItens,
                    totalPrice: totalPrice
                });
            }
        });
    }
    else {
        request.get({
            headers: { 'authorization': id_gerado },
            url: 'https://blockchain-joaocunha20.c9users.io/product/productInfo/' + id_produto,
        }, function(error, response, body) {
            var body2 = JSON.parse(body);
            var sucess = body2.success;
            if (sucess == true) {
                var product = body2.productinfo;
                var vendedor = body2.vendedor;
                var feedback = body2.feedback;
                var rating = vendedor.rating;
                var imagens = product.imagem;
                var produtos4 = body2.produtos4;
                var contaCriada = body2.vendedor.accCreatedOn;
                var d = new Date(contaCriada);
                var anoConta = d.getFullYear();
                var user = body2.user;
                res.render('product', {
                    layout: 'product',
                    productinfo: product,
                    vendedor: vendedor,
                    feedback: feedback,
                    anoConta: anoConta,
                    rating: rating,
                    imagens: imagens,
                    user: user,
                    produtos4: produtos4,
                    productsCarrinho: productsCarrinho,
                    quantidadeItens: quantidadeItens,
                    totalPrice: totalPrice
                });
            }
            else {
                var user = body2.user;
                res.render('product', {
                    layout: 'product',
                    user: user,
                    productsCarrinho: productsCarrinho,
                    quantidadeItens: quantidadeItens,
                    totalPrice: totalPrice
                });
            }
        });
    }
});

module.exports = router;
