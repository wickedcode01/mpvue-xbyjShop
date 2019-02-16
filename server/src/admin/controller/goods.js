const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */

  async indexAction(){
    return this.display();
  }

  async listAction() {
    const page = this.get('page') || 1;
    //const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('goods');
    const data = await model.where({name: ['like', `%${name}%`]}).order(['id DESC']).page(page).countSelect();

    return this.success(data);
  }

  async briefAction(){
    const length=parseInt(this.get('length'));
    const page=parseInt(this.get('start')/length)+1||1;
    const draw=parseInt(this.get('draw'));
    const model=this.model('goods');
    const data=await model.field('name,is_on_sale,id,category_id,goods_number,sell_volume,retail_price').page(page,length).countSelect();
    let data1=data;
    data1.recordsTotal=data1.count;
    data1.recordsFiltered=data1.count;
    data1.draw=draw;
    return this.json(data1);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('goods');
    const data = await model.where({id: id}).find();

    return this.json(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    //values.is_on_sale = values.is_on_sale ? 1 : 0;
    //values.is_new = values.is_new ? 1 : 0;
    //values.is_hot = values.is_hot ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success();
  }

  async delAction() {
    const id = this.post('id');
    await this.model('goods').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }

  async addAction(){
    return this.display();
  }
};
