module.exports = function Wishlist(oldWishlsit) {
    this.items = oldWishlsit.items || {};
    this.totalPrice = oldWishlsit.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item };
        }
        this.totalPrice += storedItem.item.preco;
    };

    this.removeItem = function(id) {
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.clearCart = function() {
        for (var id in this.items) {
            delete this.items[id];
        }
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        if (arr.length == 0) {
            return null
        }
        else {
            return arr;
        }
    };

    this.quantidade = function() {
        if (this.totalPrice === 0) {
            return 0
        }
        else {
            return this.generateArray().length
        }

    }
};
