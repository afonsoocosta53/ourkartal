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
var Cart = require('../models/cart');

/* ------------------------------------------------------ GETS's ------------------------------------------------- */

router.get('/logout', function(req, res) {
	res.clearCookie('id_gerado');
	res.redirect('/');
});

// LOGIN PAGE RENDER
router.get('/login', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	if (id_gerado === null || id_gerado === undefined) {
		res.render('login', { layout: 'loginLY' });
	}
	else {
		res.redirect('/')
	}
});

// INDEX PAGE RENDER
router.get('/chat', function(req, res) {
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
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/chat/user',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var user = body2.user;
			var comprados = body2.produtosComprados;
			var vendidos = body2.produtosVendidos;
			var venda = body2.produtosVenda;
			var chat = body2.chats;
			var primeiraConversa = body2.primeiraConversa;
			var id_conversinha = primeiraConversa['0']['id_Conversation'];
			var conversaselecionada = body2.first_conversation;
			var nomeuser1 = conversaselecionada.nome_user1;
			var nomeuser2 = conversaselecionada.nome_user2;
			var imagemuser1 = conversaselecionada.imagemVendedor;
			var imagemuser2 = conversaselecionada.imagemInteressado;
			console.log(chat)
			console.log("___________________________________")
			console.log(conversaselecionada)
			res.render('user', {
				layout: '',
				user: user,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				chat: chat,
				primeiraConversa: primeiraConversa,
				id_gerado: id_gerado,
				id_conversinha: id_conversinha,
				nomeuser1: nomeuser1,
				nomeuser2: nomeuser2,
				imagemuser1: imagemuser1,
				imagemuser2: imagemuser2
			});
		});
	}

});

router.get('/chat/:id_Conversation', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var id_Conversation = req.params.id_Conversation;
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
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/chat/conversa/' + id_Conversation,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var user = body2.user;
			var primeiraConversa = body2.chats;
			var chat = body2.conversa
			var nomeuser1 = primeiraConversa.nome_user1;
			var conversaselecionada = body2.first_conversation;
			var nomeuser1 = conversaselecionada.nome_user1;
			var nomeuser2 = conversaselecionada.nome_user2;
			var imagemuser1 = conversaselecionada.imagemVendedor;
			var imagemuser2 = conversaselecionada.imagemInteressado;
			console.log(chat)
			res.render('user', {
				layout: '',
				user: user,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				chat: chat,
				primeiraConversa: primeiraConversa,
				id_gerado: id_gerado,
				id_conversinha: id_Conversation,
				nomeuser1: nomeuser1,
				nomeuser2: nomeuser2,
				imagemuser1: imagemuser1,
				imagemuser2: imagemuser2
			});
		});
	}

});

router.get('/newConversation', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var id_interessado = req.query.id_interessado;
	var id_vendedor = req.query.id_vendedor;
	console.log(id_gerado)
	console.log(id_interessado)
	console.log(id_vendedor)
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
		res.redirect('/user/login')
	}
	else {
		var bodyText = 'id_interessado=' + id_interessado + '&&id_vendedor=' + id_vendedor;
		request.post({
			headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/chat/newConversation',
			body: bodyText
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var message = body2.message;
			if (message === "Conversa ja iniciada") {
				var conversa = body2.conversa;
				console.log(conversa)
				console.log("___________________________________________")
				res.redirect('/user/chat/' + conversa.id_Conversation);
			}
			else {
				var conversa = body2.conversation;
				console.log(conversa)
				console.log("___________________________________________")
				res.redirect('/user/chat/' + conversa.id_Conversation);
			}

		});
	}
})

//CONFIRMAR CONTA
router.get('/confirmarconta/:id', function(req, res) {
	var id_gerado = req.params.id;
	request.get({
		headers: { 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/user/activate/' + id_gerado,
	}, function(error, response, body) {});
	res.redirect('/');
});

// INFORMACAÇÃO DE USER

router.get('/aseguir/:page', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page || 1
	var sort = req.query.sort
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/wishlist/productsWishlist/' + page +
				'?sort=' + sort,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.wishlist;
			var user = body2.user;
			var primeira_fila = [];
			var segunda_fila = [];
			var terceira_fila = [];
			primeira_fila.push(products[0]);
			primeira_fila.push(products[1]);
			primeira_fila.push(products[2]);
			primeira_fila.push(products[3]);
			segunda_fila.push(products[4]);
			segunda_fila.push(products[5]);
			segunda_fila.push(products[6]);
			segunda_fila.push(products[7]);
			terceira_fila.push(products[8]);
			terceira_fila.push(products[9]);
			terceira_fila.push(products[10]);
			terceira_fila.push(products[11]);
			var numero_produtos = body2.numero_produtos;
			var pages = body2.pages;
			var sortfiltro = body2.sortfiltro;
			var number_pages = [];
			for (var i = 1; i <= pages; i++) {
				number_pages.push([i]);
			}
			res.render('aseguir', {
				primeira_fila: primeira_fila,
				segunda_fila: segunda_fila,
				terceira_fila: terceira_fila,
				numero_produtos: numero_produtos,
				pages: number_pages,
				currentPage: page,
				layout: 'aseguir',
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				sortfiltro: sortfiltro,
				user: user
			});
		});
	}
});

router.get('/definicoes', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo/',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var user = body2.user;
			res.render('contadefinicoes', {
				layout: 'contaPessoal',
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user
			});
		});
	}
})

router.get('/propostas', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page || 1
	var sort = req.query.sort
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/wishlist/productsWishlist/' + page +
				'?sort=' + sort,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.wishlist;
			var user = body2.user;
			var primeira_fila = [];
			var segunda_fila = [];
			var terceira_fila = [];
			primeira_fila.push(products[0]);
			primeira_fila.push(products[1]);
			primeira_fila.push(products[2]);
			primeira_fila.push(products[3]);
			segunda_fila.push(products[4]);
			segunda_fila.push(products[5]);
			segunda_fila.push(products[6]);
			segunda_fila.push(products[7]);
			terceira_fila.push(products[8]);
			terceira_fila.push(products[9]);
			terceira_fila.push(products[10]);
			terceira_fila.push(products[11]);
			var numero_produtos = body2.numero_produtos;
			var pages = body2.pages;
			var sortfiltro = body2.sortfiltro;
			var number_pages = [];
			for (var i = 1; i <= pages; i++) {
				number_pages.push([i]);
			}
			res.render('CPpropostas', {
				primeira_fila: primeira_fila,
				segunda_fila: segunda_fila,
				terceira_fila: terceira_fila,
				numero_produtos: numero_produtos,
				pages: number_pages,
				currentPage: page,
				layout: 'contaPessoal',
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				sortfiltro: sortfiltro,
				user: user
			});
		});
	}
})

router.get('/comprasrealizadas/:page', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page || 1
	var sort = req.query.sort
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/produtosCompradosConcluido/' + page,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var sucess = body2.success;
			if (sucess == true) {
				var products = body2.productinfo;
				var user = body2.user;
				var primeira_fila = [];
				var segunda_fila = [];
				var terceira_fila = [];
				primeira_fila.push(products[0]);
				primeira_fila.push(products[1]);
				primeira_fila.push(products[2]);
				primeira_fila.push(products[3]);
				segunda_fila.push(products[4]);
				segunda_fila.push(products[5]);
				segunda_fila.push(products[6]);
				segunda_fila.push(products[7]);
				terceira_fila.push(products[8]);
				terceira_fila.push(products[9]);
				terceira_fila.push(products[10]);
				terceira_fila.push(products[11]);
				var numero_produtos = body2.numero_produtos;
				var pages = body2.pages;
				var sortfiltro = body2.sortfiltro;
				var number_pages = [];
				for (var i = 1; i <= pages; i++) {
					number_pages.push([i]);
				}
				res.render('comprasrealizadas', {
					primeira_fila: primeira_fila,
					segunda_fila: segunda_fila,
					terceira_fila: terceira_fila,
					numero_produtos: numero_produtos,
					pages: number_pages,
					currentPage: page,
					layout: 'contaPessoal',
					productsCarrinho: productsCarrinho,
					quantidadeItens: quantidadeItens,
					totalPrice: totalPrice,
					sortfiltro: sortfiltro,
					user: user
				});
			}
			else {
				res.render('comprasrealizadas', { layout: 'contaPessoal' })
			}
		});
	}
})

router.get('/compraspendentes/:page', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page || 1
	var sort = req.query.sort
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/produtosComprados/' + page,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var sucess = body2.success;
			if (sucess == true) {
				var products = body2.productinfo;
				var user = body2.user;
				var primeira_fila = [];
				var segunda_fila = [];
				var terceira_fila = [];
				primeira_fila.push(products[0]);
				primeira_fila.push(products[1]);
				primeira_fila.push(products[2]);
				primeira_fila.push(products[3]);
				segunda_fila.push(products[4]);
				segunda_fila.push(products[5]);
				segunda_fila.push(products[6]);
				segunda_fila.push(products[7]);
				terceira_fila.push(products[8]);
				terceira_fila.push(products[9]);
				terceira_fila.push(products[10]);
				terceira_fila.push(products[11]);
				var numero_produtos = body2.numero_produtos;
				var pages = body2.pages;
				var sortfiltro = body2.sortfiltro;
				var number_pages = [];
				for (var i = 1; i <= pages; i++) {
					number_pages.push([i]);
				}
				res.render('compraspendentes', {
					primeira_fila: primeira_fila,
					segunda_fila: segunda_fila,
					terceira_fila: terceira_fila,
					numero_produtos: numero_produtos,
					pages: number_pages,
					currentPage: page,
					layout: 'contaPessoal',
					productsCarrinho: productsCarrinho,
					quantidadeItens: quantidadeItens,
					totalPrice: totalPrice,
					sortfiltro: sortfiltro,
					user: user
				});
			}
			else {
				res.render('compraspendentes', { layout: 'contaPessoal' })
			}
		});
	}
})

router.get('/vendasrealizadas/:page', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page || 1
	var sort = req.query.sort
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/produtosVendaConcluida/' + page,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var sucess = body2.success;
			if (sucess == true) {
				var products = body2.productinfo;
				var user = body2.user;
				var primeira_fila = [];
				var segunda_fila = [];
				var terceira_fila = [];
				primeira_fila.push(products[0]);
				primeira_fila.push(products[1]);
				primeira_fila.push(products[2]);
				primeira_fila.push(products[3]);
				segunda_fila.push(products[4]);
				segunda_fila.push(products[5]);
				segunda_fila.push(products[6]);
				segunda_fila.push(products[7]);
				terceira_fila.push(products[8]);
				terceira_fila.push(products[9]);
				terceira_fila.push(products[10]);
				terceira_fila.push(products[11]);
				var numero_produtos = body2.numero_produtos;
				var pages = body2.pages;
				var sortfiltro = body2.sortfiltro;
				var number_pages = [];
				for (var i = 1; i <= pages; i++) {
					number_pages.push([i]);
				}
				res.render('vendasrealizadas', {
					primeira_fila: primeira_fila,
					segunda_fila: segunda_fila,
					terceira_fila: terceira_fila,
					numero_produtos: numero_produtos,
					pages: number_pages,
					currentPage: page,
					layout: 'contaPessoal',
					productsCarrinho: productsCarrinho,
					quantidadeItens: quantidadeItens,
					totalPrice: totalPrice,
					sortfiltro: sortfiltro,
					user: user
				});
			}
			else {
				res.render('vendasrealizadas', { layout: 'contaPessoal' })
			}
		});
	}
})

router.get('/vendaspendentes/:page', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page || 1
	var sort = req.query.sort
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/produtosVendidos/' + page,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var sucess = body2.success;
			if (sucess == true) {
				var products = body2.productinfo;
				var user = body2.user;
				var primeira_fila = [];
				var segunda_fila = [];
				var terceira_fila = [];
				primeira_fila.push(products[0]);
				primeira_fila.push(products[1]);
				primeira_fila.push(products[2]);
				primeira_fila.push(products[3]);
				segunda_fila.push(products[4]);
				segunda_fila.push(products[5]);
				segunda_fila.push(products[6]);
				segunda_fila.push(products[7]);
				terceira_fila.push(products[8]);
				terceira_fila.push(products[9]);
				terceira_fila.push(products[10]);
				terceira_fila.push(products[11]);
				var numero_produtos = body2.numero_produtos;
				var pages = body2.pages;
				var sortfiltro = body2.sortfiltro;
				var number_pages = [];
				for (var i = 1; i <= pages; i++) {
					number_pages.push([i]);
				}
				res.render('vendaspendentes', {
					primeira_fila: primeira_fila,
					segunda_fila: segunda_fila,
					terceira_fila: terceira_fila,
					numero_produtos: numero_produtos,
					pages: number_pages,
					currentPage: page,
					layout: 'contaPessoal',
					productsCarrinho: productsCarrinho,
					quantidadeItens: quantidadeItens,
					totalPrice: totalPrice,
					sortfiltro: sortfiltro,
					user: user
				});
			}
			else {
				res.render('vendaspendentes', { layout: 'contaPessoal' })
			}
		});
	}
})

router.get('/devolucao/:id_produto', function(req, res) {
	var productsCarrinho = null;
	var id_produto = req.params.id_produto;
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
	var id_gerado = req.cookies['id_gerado'];
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo/',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var user = body2.user;
			request.get({
				headers: { 'authorization': id_gerado },
				url: 'https://blockchain-joaocunha20.c9users.io/product/productInfo/' + id_produto,
			}, function(error, response, productInfo) {
				var productInfo2 = JSON.parse(productInfo);
				var sucess = productInfo2.success;
				if (sucess == true) {
					var product = productInfo2.productinfo;
					res.render('registoDevolucao', {
						layout: 'contaPessoal',
						productsCarrinho: productsCarrinho,
						quantidadeItens: quantidadeItens,
						totalPrice: totalPrice,
						user: user,
						product: product
					});
				}
				else {

				}
			});
		});
	}
})

router.get('/reportar', function(req, res) {
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
	var id_gerado = req.cookies['id_gerado'];
	if (id_gerado === null || id_gerado === undefined) {
		res.redirect('/user/login')
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo/',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var user = body2.user;
			res.render('reportarProblema', {
				layout: 'contaPessoal',
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user
			});
		});
	}
})

router.get('/carteira/:page', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page;
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
			var conta = user.addressConta;
			request.get({
				headers: {},
				url: 'https://ehter-troublemasters.c9users.io/cripto/balance?conta=' + conta,
			}, function(error, response, body3) {
				var body4 = JSON.parse(body3);
				var balancesucess = body4.success;
				if (balancesucess == true) {
					var balance = body4.balance;
					request.get({
						headers: { 'authorization': id_gerado },
						url: 'https://blockchain-joaocunha20.c9users.io/product/balanco/' + page,
					}, function(error, response, balancebody) {
						var balancebody2 = JSON.parse(balancebody);
						var balancebodysucess = balancebody2.success;
						if (balancebodysucess == true) {
							var tableproduts = balancebody2.tabelaProdutos;
							var total_gasto = balancebody2.total_gasto;
							var total_recebido = balancebody2.total_recebido;
							var contador = balancebody2.contador;
							var number_pages = [];
							var pages = balancebody2.pages;
							for (var i = 1; i <= pages; i++) {
								number_pages.push([i]);
							}
							res.render('contacarteira', {
								productsCarrinho: productsCarrinho,
								quantidadeItens: quantidadeItens,
								totalPrice: totalPrice,
								user: user,
								layout: 'contaPessoal',
								balance: balance,
								tableproduts: tableproduts,
								total_gasto: total_gasto,
								total_recebido: total_recebido,
								contador: contador,
								pages: number_pages
							});
						}
						else {}
					});
				}
				else {

				}
			});
		}
		else {
			res.redirect('/user/login');
		}
	});
})

router.get('/registarFeedback/:id_vendedor&:id_produto', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var id_vendedor = req.params.id_vendedor;
	var id_produto = req.params.id_produto;
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
			res.render('registoFeedback', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'contaPessoal',
				id_vendedor: id_vendedor,
				id_produto: id_produto
			});
		}
		else {
			res.redirect('/user/login');
		}
	});
})

router.get('/recuperarPassword', function(req, res) {
	res.render('recuperarPass', { layout: 'loginLY' })
})

router.get('/alterarPassword', function(req, res) {
	res.render('alterarPassword', { layout: 'loginLY' })
})

router.get('/devolucoes', function(req, res) {
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
			res.render('devolucoes', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'contaPessoal'
			});
		}
		else {
			res.redirect('/user/login');
		}
	});
})

router.get('/editarPerfil', function(req, res) {
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
			res.render('editarPerfil', {
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

router.get('/perfil/:id_user', function(req, res) {
	var id_user = req.params.id_user;
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
		url: 'https://blockchain-joaocunha20.c9users.io/user/userInfo/' + id_user,
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.success;
		if (sucess == true) {
			var user = body2.user;
			var produtos = body2.produtos4;
			var feedback = body2.feedback;
			var vendedor = body2.vendedor;
			res.render('perfil', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'layout2',
				produtos: produtos,
				feedback: feedback,
				vendedor: vendedor
			});
		}
		else {
			res.redirect('/user/login');
		}
	});
})
/* ------------------------------------------------------ POST's ------------------------------------------------- */

// POST DO FORM DE REGISTO
router.post('/register', function(req, res) {
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		url: 'https://ehter-troublemasters.c9users.io/cripto/criarConta'
	}, function(error, response, body3) {
		var body4 = JSON.parse(body3)
		var address = body4.address;
		var privatekey = body4.privatekey
		var bodyText = 'username=' + req.body.username + '&&password=' + req.body.password + '&&email=' +
			req.body.email + '&&addressConta=' + address + '&&privatekey=' + privatekey;
		request.post({
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			url: 'https://blockchain-joaocunha20.c9users.io/user/signup',
			body: bodyText
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var text = body2.msg
			if (text === "Email já registado.") {
				console.log("Email já registado.")
				res.redirect("login");
			}
			else
			if (text === "Username já registado.") {
				console.log("Username já registado.")
				res.redirect("login");
			}
			else {
				request.get({
					url: 'https://blockchain-joaocunha20.c9users.io/definicoesMoeda/definicoesMoeda',
				}, function(error, response, body7) {
					var body8 = JSON.parse(body7);
					var sucess4 = body8.success;
					if (sucess4 == true) {
						var definicoesMoeda = body8.definicoesMoeda
						var bodyETH = 'quantidade=' + '1' +
							'&&toAddress=' + address + '&&myAddress=' +
							definicoesMoeda['0'].address + '&&myPrivateKey=' + definicoesMoeda['0'].privatekey;
						request.post({
							headers: { 'content-type': 'application/x-www-form-urlencoded' },
							url: 'https://ehter-troublemasters.c9users.io/cripto/tansferETH',
							body: bodyETH
						}, function(error, response, body5) {
							var body6 = JSON.parse(body5);
							var sucess2 = body6.success;
							if (sucess2 == true) {
								var bodyOTK = 'quantidade=' + definicoesMoeda['0'].quantidade +
									'&&toAddress=' + address + '&&myAddress=' +
									definicoesMoeda['0'].address + '&&myPrivateKey=' + definicoesMoeda['0'].privatekey;
								request.post({
									headers: { 'content-type': 'application/x-www-form-urlencoded' },
									url: 'https://ehter-troublemasters.c9users.io/cripto/tansferOTK',
									body: bodyOTK
								}, function(error, response, body10) {
									var body11 = JSON.parse(body10);
									var sucess10 = body11.success;
									if (sucess10 == true) {
										res.redirect('login');
									}
									else {
										res.redirect('login');
									}
								});
							}
							else {
								res.redirect('login');
							}
						});
					}
					else {
						res.redirec('login')
					}
				});
			}
		});
	});
});

// REGISTER PAGE RENDER
router.post('/novoFeedback', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'id_vendedor=' + req.body.id_vendedor + '&&rating=' + req.body.rating_input + '&&comentario=' +
		req.body.comentario + '&&id_produto=' + req.body.id_produto;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/feedback/newFeedback',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var text = body2.msg;
		var user = body2.user;
		if (text === "No token provided.") {
			console.log("No token provided.")
		}
		else {
			if (text === "Authentication failed. Chave not found.") {
				console.log("Authentication failed. Chave not found.")
			}
			else {
				if (text === "Authentication failed. User not found.") {
					console.log("Authentication failed. User not found.")
				}
				else {
					if (text === "Business already exists.") {
						console.log("Business already exists.")
					}
					else {
						console.log("Feedback registado com sucesso")
						// res.redirect('/user/perfil/' + id_vendedor);
						res.redirect('/')
					}
				}
			}
		}
	});
});

// POST DO FORM DE REGISTO
router.post('/editUser', function(req, res) {
	console.log("TESTE")
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'name=' + req.body.primeiro_nome + '&&lastName=' + req.body.last_name + '&&password=' +
		req.body.password + '&&password2=' + req.body.password2 + '&&email=' + req.body.email + '&&phone=' + req.body.phone +
		'&&address=' + req.body.address + '&&postalCode=' + req.body.postalCode + '&&country=' + req.body.country +
		'&&address2=' + req.body.address + '&&postalCode2=' + req.body.postalCode2 + '&&country2=' + req.body.country2;
	console.log(bodyText)
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/user/editUser',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var text = body2.msg
		if (text === "Email já registado.") {
			console.log("Email já registado.")
			res.redirect("/");
		}

		else {
			res.redirect('/user/definicoes');
		}

	});
});

router.post('/devolucao', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'id_produto=' + req.body.id_produto;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/devolucao/newDevolucao',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.sucess;
		if (sucess == true) {
			res.redirect('/user/compraspendentes/1');
		}
		else {
			res.redirect('/user/compraspendentes/1');
		}
	});
})


router.post('/removerProduto', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'id_produto=' + req.body.id_produto;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/product/productDelete',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.success;
		if (sucess == true) {
			res.redirect('/user/vendasrealizadas/1');
		}
		else {
			res.redirect('/user/vendasrealizadas/1');
		}
	});
})


router.post('/volvarVenda', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'id_produto=' + req.body.id_produto;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/product/productvendaAgain',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.success;
		if (sucess == true) {
			res.redirect('/user/vendaspendentes/1');
		}
		else {
			res.redirect('/user/vendasrealizadas/1');
		}
	});
})

router.post('/confirmardevolucao', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'id_produto=' + req.body.id_produto;
	console.log(req.body.id_produto)
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/product/editProductDevolucao',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.success;
		if (sucess == true) {
			var vendedor = body2.vendedor;
			var comprador = body2.comprador;
			var produto = body2.produto;
			var montante_enviar = produto.valor_transferido;
			var compradorAddress = comprador.addressConta;
			var vendedorAddress = vendedor.addressConta;
			var vendedorPrivateKey = vendedor.chavePrivada;
			var bodyOTK = 'quantidade=' + montante_enviar +
				'&&toAddress=' + compradorAddress + '&&fromAddress=' +
				vendedorAddress + '&&fromPrivateKey=' + vendedorPrivateKey;
			console.log(bodyOTK)
			request.post({
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				url: 'https://ehter-troublemasters.c9users.io/cripto/transfer',
				body: bodyOTK
			}, function(error, response, body17) {
				var body15 = JSON.parse(body17);
				var sucess12 = body15.success;
				if (sucess12 == true) {
					res.redirect('/user/vendasrealizadas/1');
				}
				else {
					res.redirect('/user/vendaspendentes/1');
				}
			});
		}
		else {
			res.redirect('/user/vendaspendentes/1');
		}
	});
})

router.post('/pedirMoeda', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	request.get({
		url: 'https://blockchain-joaocunha20.c9users.io/definicoesMoeda/definicoesMoeda',
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess4 = body2.success;
		if (sucess4 == true) {
			var definicoesMoeda = body2.definicoesMoeda
			console.log(definicoesMoeda)
			request.get({
				headers: { 'authorization': id_gerado },
				url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo/',
			}, function(error, response, body9) {
				var body10 = JSON.parse(body9);
				var sucess9 = body10.success;
				if (sucess9 == true) {
					var user = body10.user;
					var bodyOTK = 'quantidade=' + definicoesMoeda['0'].quantidade +
						'&&toAddress=' + user.addressConta + '&&myAddress=' +
						definicoesMoeda['0'].address + '&&myPrivateKey=' + definicoesMoeda['0'].privatekey;
					request.post({
						headers: { 'content-type': 'application/x-www-form-urlencoded' },
						url: 'https://ehter-troublemasters.c9users.io/cripto/tansferOTK',
						body: bodyOTK
					}, function(error, response, body10) {
						var body11 = JSON.parse(body10);
						var sucess10 = body11.success;
						if (sucess10 == true) {
							res.redirect('carteira');
						}
						else {
							res.redirect('carteira');
						}
					});
				}
				else {
					res.redirect('carteira')
				}

			});
		}
		else {
			res.redirect('login')
		}
	});
})

// LOGIN 
router.post('/login', function(req, res, next) {
	var bodyText = 'username=' + req.body.username + '&&password=' + req.body.password;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		url: 'https://blockchain-joaocunha20.c9users.io/user/authenticate',
		body: bodyText
	}, function(error, response, body) {
		console.log(body);
		var body2 = JSON.parse(body);
		var success = body2.success;
		var id_gerado = body2.id_gerado;
		if (success == true) {
			if (req.body.remember == "on") {
				res.cookie('id_gerado', id_gerado);
			}
			else {
				res.cookie('id_gerado', id_gerado, { expires: new Date(Date.now() + 3600000) });
			}
			res.redirect('../');

		}
		else {
			res.redirect('login');
		}
	});
});

// PASSAPORT LOGIN
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				}
				else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
	var myquery = { username: user.username };
	var formatted = dateTime.create();
	var timeNow = formatted.format('Y-m-d H:M:S');
	var newvalues = { $set: { lastSignedIn: timeNow } };
	db.collection("users").updateOne(myquery, newvalues, function(err, res) {
		if (err) throw err;
		console.log(myquery);
		console.log(newvalues);
	});
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

module.exports = router;
