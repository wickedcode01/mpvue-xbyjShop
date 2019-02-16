module.exports = class extends think.Controller {
  async __before() {
    // 根据token值获取用户id
    /*think.token = this.ctx.header['admin-token'] || '';
    const tokenSerivce = think.service('token', 'admin');
    think.userId = await tokenSerivce.getUserId();*/
		const data = await this.session('userinfo');
		this.assign('userinfo',data);
		//console.log(data);
    // 只允许登录操作
      if (data==null&&this.ctx.controller!='auth'&&this.ctx.controller!='login') {
				 this.redirect('/admin/login/login');
         return false;
      }
    
  }
};
