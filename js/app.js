(function () {
	/**
	 * 页面初始化
	 */
	function netEaseProduct() {
		this.cookie = new Cookie();
		this.model = new Model(this.cookie);
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
