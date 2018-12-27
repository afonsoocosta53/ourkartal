var express = require('express');
var router = express.Router();
var request = require("request");
var Cart = require('../models/cart');
var Wishlist = require('../models/wishlist');

// Get Homepage
router.get('/', function(req, res) {
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
			url: 'https://blockchain-joaocunha20.c9users.io/product/productsIndex',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
			var primeiros = [];
			var ultimos = [];
			primeiros.push(products[0]);
			primeiros.push(products[1]);
			primeiros.push(products[2]);
			primeiros.push(products[3]);
			ultimos.push(products[4]);
			ultimos.push(products[5]);
			ultimos.push(products[6]);
			ultimos.push(products[7]);
			res.render('index', {
				layout: 'layout',
				products: primeiros,
				ultimos: ultimos,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice
			});
		});
	}
	else {
		request.get({
			headers: { 'authorization': id_gerado },
			url: 'https://blockchain-joaocunha20.c9users.io/product/productsIndex',
		}, function(error, response, body) {
			var body2 = JSON.parse(body);
			var products = body2.products;
			var user = body2.user;
			var primeiros = [];
			var ultimos = [];
			primeiros.push(products[0]);
			primeiros.push(products[1]);
			primeiros.push(products[2]);
			primeiros.push(products[3]);
			ultimos.push(products[4]);
			ultimos.push(products[5]);
			ultimos.push(products[6]);
			ultimos.push(products[7]);
			res.render('index', {
				layout: 'layout',
				products: primeiros,
				ultimos: ultimos,
				user: user,
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice
			});
		});
	}

});

router.get('/carrinho', function(req, res) {
	var id_gerado = req.cookies['id_gerado'];
	request.get({
		headers: { 'authorization': id_gerado },
		url: 'https://blockchain-joaocunha20.c9users.io/user/memberinfo/',
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var sucess = body2.success;
		if (sucess == true) {
			var user = body2.user;
			if (!req.session.cart) {
				return res.render('carrinho', {
					productsCarrinho: null,
					quantidadeItens: 0,
					user: user
				});
			}
			var cart = new Cart(req.session.cart);
			res.render('carrinho', {
				productsCarrinho: cart.generateArray(),
				totalPrice: cart.totalPrice,
				quantidadeItens: cart.quantidade(),
				user: user,
				layout: 'layout2'
			});
		}
		else {
			if (!req.session.cart) {
				return res.render('carrinho', {
					productsCarrinho: null,
					quantidadeItens: 0
				});
			}
			var cart = new Cart(req.session.cart);
			res.render('carrinho', {
				productsCarrinho: cart.generateArray(),
				totalPrice: cart.totalPrice,
				quantidadeItens: cart.quantidade(),
				layout: 'layout2'
			});
		}
	});

})

router.get('/carreira', function(req, res) {
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
			res.render('carreira', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user
			});
		}
		else {
			res.render('carreira', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice
			});
		}
	});
});

router.get('/ajuda', function(req, res) {
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
			res.render('centroDeAjuda', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'layout2'
			});
		}
		else {
			res.render('centroDeAjuda', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				layout: 'layout2'
			});
		}
	});
});

router.post('/newsletter', function(req, res) {
	var email = req.body.email;
	var bodyText = 'email=' + email;
	request.post({
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		url: 'https://blockchain-joaocunha20.c9users.io/newsletter/newNewsletter',
		body: bodyText
	}, function(error, response, body) {
		var body2 = JSON.parse(body);
		var text = body2.sucess;
		if (text === false) {
			console.log("ERRO")
		}
		else {
			console.log("Newsletter registada")
		}
	});
	res.redirect('/')
})

router.get('/faq', function(req, res) {
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
			res.render('faq', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'layout2'
			});
		}
		else {
			res.render('faq', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				layout: 'layout2'
			});
		}
	});
})

router.get('/empresa', function(req, res) {
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
			res.render('empresa', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'layout2'
			});
		}
		else {
			res.render('empresa', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				layout: 'layout2'
			});
		}
	});
})

router.get('/criptomoeda', function(req, res) {
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
			res.render('criptomoeda', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'layout2'
			});
		}
		else {
			res.render('criptomoeda', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				layout: 'layout2'
			});
		}
	});
})

router.get('/todasCategorias', function(req, res) {
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
			res.render('allcategory', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				user: user,
				layout: 'layout2'
			});
		}
		else {
			res.render('allcategory', {
				productsCarrinho: productsCarrinho,
				quantidadeItens: quantidadeItens,
				totalPrice: totalPrice,
				layout: 'layout2'
			});
		}
	});
});

module.exports = router;
