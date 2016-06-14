(function () {
	/**
	 * 页面初始化
	 */
	function netEaseProduct() {
		this.store = new Store();
		this.model = new Model(this.store);
		this.template = new Template();
		this.view = new View(this.template);
		this.controller = new Controller(this.model, this.view);
	}

	var product = new netEaseProduct();

	function setView() {
		product.controller.setView(document.location.hash);
	}
	
	setView();
})();
