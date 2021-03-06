const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */

  async allAction() {
    return this.display();
  }

  async nowAction() {
    return this.display();
  }

  async indexAction() {
    const length = parseInt(this.get('length'));
    const page = parseInt(this.get('start') / length) + 1 || 1;
    // const draw = parseInt(this.get('draw'));
    // console.log(length + ' ' + page);
    const orderSn = this.get('orderSn') || '';
    const consignee = this.get('consignee') || '';
    const isNow = this.get('isNow') || 0;
    const model = this.model('order');
    let data;
    if (isNow === '1') {
      data = await model.where({order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`], order_status: ['NOTIN', [101, 102]]}).order(['id DESC']).page(page, length).countSelect();
      // console.log(isNow);
    } else {
      data = await model.where({order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, length).countSelect();
      // console.log(isNow);
    }

    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);
      item.goods = await this.model('order').getGoodsName(item.id);
      newList.push(item);
    }
    data.recordsTotal = data.count;
    data.recordsFiltered = data.count;
    data.data = newList;
    return this.json(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('order');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('order');
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('order').where({id: id}).limit(1).delete();

    // 删除订单商品
    await this.model('order_goods').where({order_id: id}).delete();

    // TODO 事务，验证订单是否可删除（只有失效的订单才可以删除）

    return this.success();
  }

  async cancelAction() {
    const id = this.get('id');
    await this.model('order').where({id: id}).limit(1).update({order_status: 101});
    return this.success();
  }
};
