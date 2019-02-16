const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction(){
    // 获取收货地址信息和计算运费
    const addressId = this.post('addressId');
    const checkedAddress = await this.model('address').where({ id: addressId }).find();
    const goodsId=this.post('goodsId');
    const productsId=this.post('productsId');
    const number=this.post('number');
    if (think.isEmpty(checkedAddress)) {
      return this.fail('请选择收货地址');
    }
    const freightPrice = 0.00;
    // 获取要购买的商品
    const checkedGoods = await this.model('goods').join('xbyjshop_product on goods.id=product.goods_id').field('xbyjshop_goods.id as goods_id,xbyjshop_product.id as product_id,xbyjshop_product.retail_price,xbyjshop_goods.goods_name,xbyjshop_goods.list_pic_url,xbyjshop_goods.market_price,xbyjshop_goods.goods_specifition_name_value,xbyjshop_goods.goods_specifition_ids').where({goods_id:goodsId,product_id:productsId}).find();

    // 统计商品总价
    let goodsTotalPrice;
    goodsTotalPrice=checkedGoods.retail_price*number;

    // 订单价格计算
    const orderTotalPrice = goodsTotalPrice + freightPrice ; // 订单的总价
    const actualPrice = orderTotalPrice - 0.00; // 减去其它支付的金额后，要实际支付的金额
    const currentTime = parseInt(this.getTime() / 1000);

    const orderInfo = {
      order_sn: this.model('order').generateOrderNumber(),
      user_id: think.userId,
      // 收货地址和运费
      consignee: checkedAddress.name,
      mobile: checkedAddress.mobile,
      province: checkedAddress.province_id,
      city: checkedAddress.city_id,
      district: checkedAddress.district_id,
      address: checkedAddress.address,
      freight_price: 0.00,
      // 留言
      postscript: this.post('postscript'),
      add_time: currentTime,
      goods_price: goodsTotalPrice,
      order_price: orderTotalPrice,
      actual_price: actualPrice
    };
    // 开启事务，插入订单信息和订单商品
    const orderId = await this.model('order').add(orderInfo);
    orderInfo.id = orderId;
    if (!orderId) {
      return this.fail('订单提交失败');
    }
    // 统计商品总价
    const orderGoodsData =
      {
        order_id: orderId,
        goods_id: checkedGoods.goods_id,
        product_id: checkedGoods.product_id,
        goods_name: checkedGoods.goods_name,
        list_pic_url: checkedGoods.list_pic_url,
        market_price: checkedGoods.market_price,
        retail_price: checkedGoods.retail_price,
        number: number,
        goods_specifition_name_value: checkedGoods.goods_specifition_name_value,
        goods_specifition_ids: checkedGoods.goods_specifition_ids
      };

    await this.model('order_goods').add(orderGoodsData);
    return this.success({ orderInfo: orderInfo });

  }
}
