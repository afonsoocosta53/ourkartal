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
var Wishlist = require('../models/wishlist');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var breadcrumbs = require('express-seo-breadcrumbs');
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/img/')
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})
var upload = multer({ storage: storage });

/* ------------------------------------------------------ GETS's ------------------------------------------------- */

// REGISTER PAGE RENDER
router.post('/vender', upload.array('imagem', 10), function(req, res) {
	if (req.body.categoriaproduto === "bebes") {
		var subcategoria = req.body.subcategoriaprodutobebes;
	}
	else {}
	if (req.body.categoriaproduto === "livros") {
		var subcategoria = req.body.subcategoriaprodutolivros;
	}
	else {}
	if (req.body.categoriaproduto === "telemoveis") {
		var subcategoria = req.body.subcategoriaprodutotelemovel;
	}
	else {}
	if (req.body.categoriaproduto === "eletronica") {
		var subcategoria = req.body.subcategoriaprodutotecnologia;
	}
	else {}
	if (req.body.categoriaproduto === "informatica") {
		var subcategoria = req.body.subcategoriaprodutoinformatica;
	}
	else {}
	if (req.body.categoriaproduto === "jogos") {
		var subcategoria = req.body.subcategoriaprodutojogos;
	}
	else {}
	if (req.body.categoriaproduto === "moda") {
		var subcategoria = req.body.subcategoriaprodutomoda;
	}
	else {}
	if (req.body.categoriaproduto === "casa") {
		var subcategoria = req.body.subcategoriaprodutocasa;
	}
	else {}
	if (req.body.categoriaproduto === "equipamentos") {
		var subcategoria = req.body.subcategoriaprodutoequipamentos;
	}
	else {}
	if (req.body.categoriaproduto === "musica") {
		var subcategoria = req.body.subcategoriaprodutomusica;
	}
	else {}
	if (req.body.categoriaproduto === "desporto") {
		var subcategoria = req.body.subcategoriaprodutodesporto;
	}
	else {}
	if (req.body.categoriaproduto === "outros") {
		var subcategoria = "outros";
	}
	else {}
	if (req.body.negociavel === "on") {
		var negociavel = "sim";
	}
	else {}
	if (req.body.negociavel == undefined) {
		var negociavel = "nao";
	}
	else {}
	var images = [];
	var files = req.files;
	files.forEach(function(image) {
		images.push(image.filename);
	});
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'nome_produto=' + req.body.nome_produto + '&&categoria=' + req.body.categoriaproduto + '&&descricao=' +
		req.body.descricao + '&&preco=' + req.body.preco + '&&negociavel=' + negociavel + '&&imagem=' + images + '&&subcategoria=' + subcategoria + '&&cidade=' + req.body.cidade;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/product/newProduct',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var productR = body2.productR;
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
						console.log("Produto registado com sucesso")
						res.redirect('/product/' + productR.id_produto);
					}
				}
			}
		}
	});
});

router.post('/editarProduto', upload.array('imagem', 10), function(req, res) {
	var id_produto = req.body.id_produto;
	if (req.body.categoriaproduto === "bebes") {
		var subcategoria = req.body.subcategoriaprodutobebes;
	}
	else {}
	if (req.body.categoriaproduto === "livros") {
		var subcategoria = req.body.subcategoriaprodutolivros;
	}
	else {}
	if (req.body.categoriaproduto === "telemoveis") {
		var subcategoria = req.body.subcategoriaprodutotelemovel;
	}
	else {}
	if (req.body.categoriaproduto === "eletronica") {
		var subcategoria = req.body.subcategoriaprodutotecnologia;
	}
	else {}
	if (req.body.categoriaproduto === "informatica") {
		var subcategoria = req.body.subcategoriaprodutoinformatica;
	}
	else {}
	if (req.body.categoriaproduto === "jogos") {
		var subcategoria = req.body.subcategoriaprodutojogos;
	}
	else {}
	if (req.body.categoriaproduto === "moda") {
		var subcategoria = req.body.subcategoriaprodutomoda;
	}
	else {}
	if (req.body.categoriaproduto === "casa") {
		var subcategoria = req.body.subcategoriaprodutocasa;
	}
	else {}
	if (req.body.categoriaproduto === "equipamentos") {
		var subcategoria = req.body.subcategoriaprodutoequipamentos;
	}
	else {}
	if (req.body.categoriaproduto === "musica") {
		var subcategoria = req.body.subcategoriaprodutomusica;
	}
	else {}
	if (req.body.categoriaproduto === "desporto") {
		var subcategoria = req.body.subcategoriaprodutodesporto;
	}
	else {}
	if (req.body.categoriaproduto === "outros") {
		var subcategoria = "outros";
	}
	else {}
	if (req.body.negociavel === "on") {
		var negociavel = "sim";
	}
	else {}
	if (req.body.negociavel == undefined) {
		var negociavel = "nao";
	}
	else {}
	var images = [];
	var files = req.files;
	files.forEach(function(image) {
		images.push(image.filename);
	});
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'nome_produto=' + req.body.nome_produto + '&&id_produto=' + id_produto + '&&categoria=' + req.body.categoriaproduto + '&&descricao=' +
		req.body.descricao + '&&preco=' + req.body.preco + '&&negociavel=' + negociavel + '&&imagem=' + images + '&&subcategoria=' + subcategoria + '&&cidade=' + req.body.cidade;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/product/editProduct',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.success;
		if (sucess == true) {
			res.redirect('/product/' + id_produto);
		}
		else {
			res.redirect('/product/' + id_produto);
		}
	});
});

router.get('/vender', function(req, res) {
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
		/*request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			res.render('registarProduto', {
				layout: 'layout',
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice
			});
		});*/
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var user = body2.user;
			res.render('registarProduto', {
				layout: 'layout',
				user: user,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice
			});
		});
	}
})

router.get('/remove-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect(req.get('referer'));
});

router.get('/clear-cart', function(req, res, next) {
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.clearCart();
	req.session.cart = cart;
	res.redirect('/carrinho');
});

router.get('/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	request.get({
		headers: {},
		url: 'https://blockchain-joaocunha20.c9users.io/product/productCart/' + productId,
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.success;
		var productinfo = body2.productinfo;
		if (sucess == true) {
			cart.add(productinfo, productinfo.id_produto);
			req.session.cart = cart;
			return res.redirect('/carrinho');
		}
		else {
			return res.redirect('/carrinho');
		}
	});
});

router.get('/add-to-wishlist/:id', function(req, res, next) {
	var productId = req.params.id;
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'id_produto=' + productId;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/wishlist/addWishlist',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var text = body2.msg;
		if (text === "Authentication failed. Chave not found.") {
			console.log("Authentication failed. Chave not found.")
			return res.redirect('/');
		}
		else {
			if (text === "Authentication failed. User not found.") {
				console.log("Authentication failed. User not found.")
				return res.redirect('/');
			}
			else {
				if (text === "Authentication failed. User not found.") {
					console.log("Authentication failed. User not found.")
					return res.redirect('/');
				}
				else {
					if (text === "Product not found.") {
						console.log("Product not found.")
						return res.redirect('/');
					}
					else {
						return res.redirect('/user/aseguir/1');
					}
				}
			}
		}
	});
});

router.get('/remover-wishlist/:id', function(req, res, next) {
	var productId = req.params.id;
	var id_gerado = req.cookies['id_gerado'];
	var bodyText = 'id_produto=' + productId;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/wishlist/wishlistDelete',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var text = body2.msg;
		if (text === "Authentication failed. Chave not found.") {
			console.log("Authentication failed. Chave not found.")
			return res.redirect('/');
		}
		else {
			if (text === "Authentication failed. User not found.") {
				console.log("Authentication failed. User not found.")
				return res.redirect('/');
			}
			else {
				if (text === "Authentication failed. User not found.") {
					console.log("Authentication failed. User not found.")
					return res.redirect('/');
				}
				else {
					if (text === "Product not found.") {
						console.log("Product not found.")
						return res.redirect('/');
					}
					else {
						return res.redirect('/user/aseguir/1');
					}
				}
			}
		}
	});
});

router.get('/:page', function(req, res) {
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
	var negociavel = req.query.negociavel
	var cidade = req.query.cidade
	var vendedor = req.query.rating
	var categoria = req.query.categoria
	var subcategoria = req.query.subcategoria
	var de = req.query.de
	var ate = req.query.ate
	var texto_procura = req.query.texto_procura;
	if (subcategoria === "universitarios") {
		var subcategoria = "universitarios e academicos"
	}
	if (categoria === undefined) {
		var categoria = req.query.categoria_procura
	}
	if (req.query.categoria_procura === "todas") {
		var categoriaselecionada = "todas"
	}
	if (subcategoria === undefined) {
		req.breadcrumbs({ name: 'Home', url: '/' });
		req.breadcrumbs({ name: 'Produtos', url: '/products/1?categoria=' + categoria });
		var breadcrumbs = req.breadcrumbs();
	}
	else {
		req.breadcrumbs({ name: 'Home', url: '/' });
		req.breadcrumbs({ name: 'Produtos', url: '/products/1?categoria=' + categoria });
		req.breadcrumbs({ name: subcategoria, url: '/products/1?categoria=' + categoria + '&subcategoria=' + subcategoria });
		var breadcrumbs = req.breadcrumbs();
	}
	if (id_gerado === null || id_gerado === undefined) {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/testeProcurar/' + page + '?categoria=' + categoria + '&subcategoria=' + subcategoria +
				'&rating=' + vendedor + '&de=' + de + '&ate=' + ate + '&cidade=' + cidade + '&negociavel=' + negociavel + '&sort=' + sort + '&texto_procura=' + texto_procura,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
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
			var local = body2.local;
			var negociavelsim = body2.negociavelsim;
			var filtrosativos = body2.filtrosativos;
			var rating = body2.rating;
			var preco = body2.preco;
			var sortfiltro = body2.sortfiltro;
			var subcategoriafiltro = body2.subcategoriafiltro;
			var number_pages = [];
			var subcategoria = body2.subcategoria;
			var precoMaisBarato = body2.precoMaisBarato
			var precoMaisCaro = body2.precoMaisCaro
			for (var i = 1; i <= pages; i++) {
				number_pages.push([i]);
			}
			res.render('products', {
				primeira_fila: primeira_fila,
				segunda_fila: segunda_fila,
				terceira_fila: terceira_fila,
				numero_produtos: numero_produtos,
				pages: number_pages,
				currentPage: page,
				layout: 'layout2',
				filtros: filtrosativos,
				rating: rating,
				classificacao: vendedor,
				preco: preco,
				preco_de: de,
				preco_ate: ate,
				categoria: 'active',
				categoria_selecionada: categoria,
				negociavel: negociavelsim,
				negociavel_tipo: negociavel,
				local: local,
				localizacao: cidade,
				subcategoriafiltro: subcategoriafiltro,
				subcategoria: subcategoria,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				breadcrumbs: breadcrumbs,
				limiteinferior: precoMaisCaro,
				limitesuperior: precoMaisBarato,
				sortfiltro: sortfiltro,
				categoriaselecionada: categoriaselecionada,
				subcategoria: subcategoria
			});
		});
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/testeProcurar/' + page + '?categoria=' + categoria + '&subcategoria=' + subcategoria +
				'&rating=' + vendedor + '&de=' + de + '&ate=' + ate + '&cidade=' + cidade + '&negociavel=' + negociavel + '&sort=' + sort + '&texto_procura=' + texto_procura,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
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
			var local = body2.local;
			var negociavelsim = body2.negociavelsim;
			var filtrosativos = body2.filtrosativos;
			var rating = body2.rating;
			var preco = body2.preco;
			var subcategoriafiltro = body2.subcategoriafiltro;
			var subcategoria = body2.subcategoria;
			var number_pages = [];
			var sortfiltro = body2.sortfiltro;
			var precoMaisBarato = body2.precoMaisBarato
			var precoMaisCaro = body2.precoMaisCaro
			for (var i = 1; i <= pages; i++) {
				number_pages.push([i]);
			}
			res.render('products', {
				primeira_fila: primeira_fila,
				segunda_fila: segunda_fila,
				terceira_fila: terceira_fila,
				numero_produtos: numero_produtos,
				pages: number_pages,
				currentPage: page,
				layout: 'layout2',
				filtros: filtrosativos,
				rating: rating,
				classificacao: vendedor,
				preco: preco,
				preco_de: de,
				preco_ate: ate,
				categoria: 'active',
				categoria_selecionada: categoria,
				negociavel: negociavelsim,
				negociavel_tipo: negociavel,
				local: local,
				localizacao: cidade,
				subcategoriafiltro: subcategoriafiltro,
				user: user,
				subcategoria: subcategoria,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				limiteinferior: precoMaisCaro,
				limitesuperior: precoMaisBarato,
				sortfiltro: sortfiltro,
				subcategoria: subcategoria
			});
		});
	}
});

router.get('/productsUser/:page&:id_vendedor', function(req, res) {
	var id_vendedor = req.params.id_vendedor;
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
	var negociavel = req.query.negociavel
	var cidade = req.query.cidade
	var vendedor = req.query.rating
	var categoria = req.query.categoria
	var subcategoria = req.query.subcategoria
	var de = req.query.de
	var ate = req.query.ate
	var texto_procura = req.query.texto_procura;
	if (categoria === undefined) {
		var categoria = req.query.categoria_procura
	}
	if (req.query.categoria_procura === "todas") {
		var categoriaselecionada = "todas"
	}
	if (id_gerado === null || id_gerado === undefined) {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/productsUser/' + page + '?categoria=' + categoria + '&subcategoria=' + subcategoria +
				'&rating=' + vendedor + '&de=' + de + '&ate=' + ate + '&cidade=' + cidade + '&negociavel=' + negociavel + '&sort=' + sort + '&id_vendedor=' + id_vendedor,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
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
			var local = body2.local;
			var negociavelsim = body2.negociavelsim;
			var filtrosativos = body2.filtrosativos;
			var rating = body2.rating;
			var preco = body2.preco;
			var sortfiltro = body2.sortfiltro;
			var subcategoriafiltro = body2.subcategoriafiltro;
			var number_pages = [];
			for (var i = 1; i <= pages; i++) {
				number_pages.push([i]);
			}
			res.render('productsUser', {
				primeira_fila: primeira_fila,
				segunda_fila: segunda_fila,
				terceira_fila: terceira_fila,
				numero_produtos: numero_produtos,
				pages: number_pages,
				currentPage: page,
				layout: 'productsUser',
				filtros: filtrosativos,
				rating: rating,
				classificacao: '4 estrelas ou mais',
				preco: preco,
				preco_de: de,
				preco_ate: ate,
				categoria: 'active',
				categoria_selecionada: categoria,
				negociavel: negociavelsim,
				negociavel_tipo: negociavel,
				local: local,
				localizacao: cidade,
				subcategoriafiltro: subcategoriafiltro,
				subcategoria: subcategoria,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				breadcrumbs: breadcrumbs,
				limiteinferior: 34,
				limitesuperior: 56,
				sortfiltro: sortfiltro,
				categoriaselecionada: categoriaselecionada
			});
		});
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/productsUser/' + page + '?categoria=' + categoria + '&subcategoria=' + subcategoria +
				'&rating=' + vendedor + '&de=' + de + '&ate=' + ate + '&cidade=' + cidade + '&negociavel=' + negociavel + '&sort=' + sort + '&id_vendedor=' + id_vendedor,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
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
			var local = body2.local;
			var negociavelsim = body2.negociavelsim;
			var filtrosativos = body2.filtrosativos;
			var rating = body2.rating;
			var preco = body2.preco;
			var subcategoriafiltro = body2.subcategoriafiltro;
			var subcategoria = body2.subcategoria;
			var number_pages = [];
			var sortfiltro = body2.sortfiltro;
			for (var i = 1; i <= pages; i++) {
				number_pages.push([i]);
			}
			res.render('productsUser', {
				primeira_fila: primeira_fila,
				segunda_fila: segunda_fila,
				terceira_fila: terceira_fila,
				numero_produtos: numero_produtos,
				pages: number_pages,
				currentPage: page,
				layout: 'productsUser',
				filtros: filtrosativos,
				rating: rating,
				classificacao: '4 estrelas ou mais',
				preco: preco,
				preco_de: de,
				preco_ate: ate,
				categoria: 'active',
				categoria_selecionada: categoria,
				negociavel: negociavelsim,
				negociavel_tipo: negociavel,
				local: local,
				localizacao: cidade,
				subcategoriafiltro: subcategoriafiltro,
				user: user,
				subcategoria: subcategoria,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				limiteinferior: 10,
				limitesuperior: 30,
				sortfiltro: sortfiltro
			});
		});
	}
});

router.get('/editarProduto/:id_produto', function(req, res) {
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
		res.redirect('/user/login')
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
				if (user.accountNumber === vendedor.accountNumber) {
					res.render('editarProduto', {
						layout: 'layout',
						productinfo: product,
						vendedor: vendedor,
						feedback: feedback,
						anoConta: anoConta,
						rating: rating,
						imagens: imagens,
						user: user,
						productsCarrinho: productsCarrinho,
						quantidadeItens: quantidadeItens,
						totalPrice: totalPrice
					});
				}
				else {
					res.redirect('/product/' + id_produto)
				}
			}
			else {
				var user = body2.user;
				res.render('editarProduto', {
					layout: 'layout',
					user: user,
					productsCarrinho: productsCarrinho,
					quantidadeItens: quantidadeItens,
					totalPrice: totalPrice
				});
			}
		});
	}
})
// INDEX PAGE RENDER
/*router.get('/preco_ascendente/:page', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	var page = req.params.page || 1
	console.log(id_gerado);
	console.log(page);
	if (id_gerado === null || id_gerado === undefined) {
		console.log("VAZIO");
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/allProducts/preco_ascendente/' + page,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
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
			var number_pages = [];
			for (var i = 1; i <= pages; i++) {
				number_pages.push([i]);
			}
			var currentPage = body2.currentPage;
			res.render('products', { primeira_fila: primeira_fila, segunda_fila: segunda_fila, terceira_fila: terceira_fila, numero_produtos: numero_produtos, pages: number_pages, currentPage: page });
		});
	}
	else {
		console.log("LOGADO");
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/allProducts/' + page,
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
			var user = body2.user;
			var numero_produtos = body2.numero_produtos;
			res.render('products', { products: products, user: user, numero_produtos: numero_produtos });
		});
	}
});*/


/* ------------------------------------------------------ POST's ------------------------------------------------- */

// Function for getting breadcrumbs of the page
function getBreadcrumbs(req, res, next) {
	const urls = req.originalUrl.split('/');
	urls.shift();
	req.breadcrumbs = urls.map((url, i) => {
		return {
			breadcrumbName: (url === '' ? 'Home' : url.charAt(0).toUpperCase() + url.slice(1)),
			breadcrumbUrl: `/${urls.slice(0, i + 1).join('/')}`,
		};
	});
}
module.exports = router;
