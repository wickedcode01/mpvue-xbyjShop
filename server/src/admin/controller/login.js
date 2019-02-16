const Base = require('./base.js');
module.exports = class extends Base {
	async loginAction(){
		return this.display();
	}
	async logoutAction(){
		await this.session(null);
		return this.redirect('/admin/login/login');
	}
}