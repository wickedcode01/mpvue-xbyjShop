<template>
    <div>
        <div class="container">
            <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
                <swiper-item v-for="(item, index) of gallery" :key="item.id" :data-index="index">
                    <img :src="item.img_url" background-size="cover" />
                </swiper-item>
            </swiper>
            <div class="service-policy">
                <div class="item">30天无忧退货</div>
                <div class="item">48小时快速退款</div>
                <div class="item">满88元免邮费</div>
            </div>
            <div class="goods-info">
                <div class="c">
                    <span class="name">{{goods.name}}</span>
                    <span class="desc">{{goods.goods_brief}}</span>
                    <span class="price">￥{{goods.retail_price}}</span>
                    <div class="brand" v-if="brand.name">
                        <navigator :url="'../brand/brandDetail?id=' + brand.id">
                            <span>{{brand.name}}</span>
                        </navigator>
                    </div>
                </div>
            </div>

            <div class="section-nav section-attr" @click="switchAttrPop">
                <div class="t">请选择规格数量</div>
                <img class="i" src="/static/images/address_right.png" background-size="cover" />
            </div>

            <div class="comments" v-if="comment.count > 0">
                <div class="h">
                    <navigator :url="'../comment/comment?valueId=' + goods.id + '&typeId=0'">
                        <span class="t">评价({{comment.count > 999 ? '999+' : comment.count}})</span>
                        <span class="i">查看全部</span>
                    </navigator>
                </div>
                <div class="b">
                    <div class="item">
                        <div class="info">
                            <div class="user">
                                <img :src="comment.data.avatar" />
                                <span>{{comment.data.nickname}}</span>
                            </div>
                            <div class="time">{{comment.data.add_time}}</div>
                        </div>
                        <div class="content">
                            {{comment.data.content}}
                        </div>
                        <div class="imgs" v-if="comment.data.pic_list.length">
                            <image class="img" v-for="(item, index) of comment.data.pic_list" :key="item.id"
                                :data-index="index" :src="item.pic_url" />
                        </div>
                        <div class="spec">白色 2件</div>
                    </div>
                </div>
            </div>

            <div class="goods-attr">
                <div class="t">商品参数</div>
                <div class="l">
                    <div class="item" v-for="(item, index) of attribute" :key="item.name" :data-index="index">
                        <span class="left">{{item.name}}</span>
                        <span class="right">{{item.value}}</span>
                    </div>
                </div>
            </div>

            <div>
                <wxParse :content="goodDetailHTMLstr"></wxParse>
            </div>

            <div class="common-problem">
                <div class="h">
                    <div class="line"></div>
                    <span class="title">常见问题</span>
                </div>
                <div class="b">
                    <div class="item" v-for="(item, index) of issueList" :key="item.id" :data-index="index">
                        <div class="question-box">
                            <span class="spot"></span>
                            <span class="question">{{item.question}}</span>
                        </div>
                        <div class="answer">
                            {{item.answer}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="related-goods" v-if="relatedGoods.length">
                <div class="h">
                    <div class="line"></div>
                    <span class="title">大家都在看</span>
                </div>
                <div class="b">
                    <div class="item" v-for="(item, index) of relatedGoods" :key="item.id" :data-index="index">
                        <navigator :url="'/pages/goods/goods?id=' + item.id">
                            <img class="img" :src="item.list_pic_url" background-size="cover" />
                            <span class="name">{{item.name}}</span>
                            <span class="price">￥{{item.retail_price}}</span>
                        </navigator>
                    </div>
                </div>
            </div>
        </div>
        <!--产品规格-->
        <div class="attr-pop-box" :hidden="!openAttr">
            <div class="attr-pop">
                <div class="close" @click="closeAttr">
                    <img class="icon" src="/static/images/icon_close.png" />
                </div>
                <div class="img-info">
                    <img class="img" :src="gallery[0].img_url" />
                    <div class="info">
                        <div class="c">
                            <div class="p">价格：￥{{goods.retail_price}}</div>
                            <div class="a" v-if="productList.length">已选择：{{checkedSpecspan}}</div>
                        </div>
                    </div>
                </div>
                <div class="spec-con">
                    <div class="spec-item" v-for="(item, index) of specificationList" :key="item.specification_id"
                        :data-index="index">
                        <div class="name">{{item.name}}</div>
                        <div class="values">
                            <div :class="iitem.checked ? 'selected value' : 'value'" @click="clickSkuValue" v-for="(iitem, iindex) of item.valueList"
                                :key="iitem.id" :data-value-id="iitem.id" :data-index="iindex" :data-name-id="iitem.specification_id">{{iitem.value}}</div>
                        </div>
                    </div>
                    <div class="number-item">
                        <div class="name">数量</div>
                        <div class="selnum">
                            <div class="cut" @click="cutNumber">-</div>
                            <input :value="number" class="number" disabled="true" type="number" />
                            <div class="add" @click="addNumber">+</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom-btn">
            <div class="l l-collect" @click="addCannelCollect">
                <img class="icon" :src="collectBackImage" />
            </div>
            <div class="l l-cart">
                <div class="box">
                    <span class="cart-count">{{cartGoodsCount}}</span>
                    <img @click="openCartPage" class="icon" src="/static/images/ic_menu_shoping_nor.png" />
                </div>
            </div>
            <div class="c" @click="buyInstant">立即购买</div>
            <div class="r" @click="addToCart">加入购物车</div>
        </div>
    </div>
</template>

<script>
    import api from '@/utils/api'
    import wx from 'wx';
    import wxParse from 'mpvue-wxparse'

    export default {
        components: {
            wxParse
        },
        data() {
            return {
                id: 0,
                goods: {},
                gallery: [{
                    img_url: ''
                }],
                attribute: [],
                issueList: [],
                comment: [],
                brand: {},
                specificationList: [],
                productList: [],
                relatedGoods: [],
                cartGoodsCount: 0,
                userHasCollect: 0,
                number: 1,
                checkedSpecspan: '请选择规格数量',
                openAttr: false,
                noCollectImage: '/static/images/icon_collect.png',
                hasCollectImage: '/static/images/icon_collect_checked.png',
                collectBackImage: '/static/images/icon_collect.png',
                goodDetailHTMLstr: ''
            }
        },
        async mounted() {
            if (this.$route.query.id) {
                this.id = parseInt(this.$route.query.id);
            }
            await Promise.all([
                this.getGoodsInfo()
            ]);
            const res = await api.getCartGoodsCount();
            // console.log('购物车商品数量,请求结果', res);
            if (res.errno === 0) {
                this.cartGoodsCount = res.data.cartTotal.goodsCount;
            }
        },
        methods: {
            // 获取商品详情
            async getGoodsInfo() {
                const res = await api.getGoodsDetail({
                    id: this.id
                });
                // console.log('商品详情,请求结果', res);
                if (res.errno === 0) {
                    this.goods = res.data.info;
                    this.gallery = res.data.gallery.length > 0 ? res.data.gallery : [{
                        img_url: '/static/images/icon_error.png'
                    }];
                    this.attribute = res.data.attribute;
                    this.issueList = res.data.issue;
                    this.comment = res.data.comment;
                    this.brand = res.data.brand;
                    this.specificationList = res.data.specificationList;
                    this.productList = res.data.productList;
                    this.userHasCollect = res.data.userHasCollect;
                    if (res.data.userHasCollect === 1) {
                        this.collectBackImage = this.hasCollectImage;
                    } else {
                        this.collectBackImage = this.noCollectImage;
                    }
                    // wxParse的内容
                    this.goodDetailHTMLstr = res.data.info.goods_desc ? res.data.info.goods_desc : '暂无详情数据';
                    // 取“相关商品推荐”信息
                    this.getGoodsRelated();
                }
            },
            // 获得“相关商品推荐”信息
            async getGoodsRelated() {
                const res = await api.getGoodsRelated({
                    id: this.id
                });
                // console.log('相关商品推荐', res);
                if (res.errno === 0) {
                    this.relatedGoods = res.data.goodsList;
                }
            },
            // 规格弹窗中，每个规则项的点击事件
            clickSkuValue(event) {
                let specNameId = event.currentTarget.dataset.nameId;
                let specValueId = event.currentTarget.dataset.valueId;
                // 判断是否可以点击
                // TODO 性能优化，可在v-for中添加index，可以直接获取点击的属性名和属性值，不用循环
                let _specificationList = this.specificationList;
                for (let i = 0; i < _specificationList.length; i++) {
                    if (_specificationList[i].specification_id === specNameId) {
                        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                            if (_specificationList[i].valueList[j].id === specValueId) {
                                // 如果已经选中，则反选
                                if (_specificationList[i].valueList[j].checked) {
                                    _specificationList[i].valueList[j].checked = false;
                                } else {
                                    _specificationList[i].valueList[j].checked = true;
                                }
                            } else {
                                _specificationList[i].valueList[j].checked = false;
                            }
                        }
                    }
                }
                this.specificationList = _specificationList;
                // 重新计算spec改变后的信息
                this.changeSpecInfo();
                // 重新计算哪些值不可以点击
            },
            // 获取选中的规格信息,存到数组中，其他方法有3处调用
            getCheckedSpecValue() {
                let checkedValues = [];
                let _specificationList = this.specificationList;
                for (let i = 0; i < _specificationList.length; i++) {
                    let _checkedObj = {
                        nameId: _specificationList[i].specification_id,
                        valueId: 0,
                        valuespan: ''
                    };
                    for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                        if (_specificationList[i].valueList[j].checked) {
                            _checkedObj.valueId = _specificationList[i].valueList[j].id;
                            _checkedObj.valuespan = _specificationList[i].valueList[j].value;
                        }
                    }
                    checkedValues.push(_checkedObj);
                }
                // console.log(checkedValues);
                return checkedValues;
            },
            // 根据已选的值，计算其它值的状态
            setSpecValueStatus() {

            },
            // 判断规格是否选择完整(每一种至少选择一项)，加入购物车前进行判断
            isCheckedAllSpec() {
                return !this.getCheckedSpecValue().some(function(v) {
                    if (v.valueId === 0) {
                        return true;
                    }
                });
            },
            // 拿到规格的key，库存判断时调用
            getCheckedSpecKey() {
                let checkedValue = this.getCheckedSpecValue().map(function(v) {
                    return v.valueId;
                });
                // console.log('getCheckedSpecKey', checkedValue.join('_'));
                return checkedValue.join('_');
            },
            // 每次点击规格项，重新计算规格的信息
            changeSpecInfo() {
                let checkedNameValue = this.getCheckedSpecValue();
                // 设置选择的信息
                let checkedValue = checkedNameValue.filter(function(v) {
                    if (v.valueId !== 0) {
                        return true;
                    } else {
                        return false;
                    }
                }).map(function(v) {
                    return v.valuespan;
                });
                if (checkedValue.length > 0) {
                    this.checkedSpecspan = checkedValue.join('　');
                } else {
                    this.checkedSpecspan = '请选择规格数量';
                }
            },
            // 判断库存时调用，key是计算我们选择的规则，类似1_3_7
            getCheckedProductItem(key) {
                // console.log('this.data.productList', this.data.productList);
                return this.productList.filter(function(v) {
                    if (v.goods_specification_ids === key) {
                        return true;
                    } else {
                        return false;
                    }
                });
            },
            // 打开商品规格选择弹窗
            switchAttrPop() {
                if (this.openAttr === false) {
                    this.openAttr = !this.openAttr;
                }
            },
            // 关闭规格弹窗
            closeAttr() {
                this.openAttr = false;
            },
            // 购物车的五角星，添加或是取消收藏
            async addCannelCollect() {
                const res = await api.CollectAddOrDelete({
                    typeId: 0,
                    valueId: this.id
                });
                // console.log('添加或取消收藏', res);
                if (res.errno === 0) {
                    if (res.data.type === 'add') {
                        this.collectBackImage = this.hasCollectImage;
                    } else {
                        this.collectBackImage = this.noCollectImage;
                    }
                } else {
                    wx.showToast({
                        image: '/static/images/icon_error.png',
                        title: res.errmsg,
                        mask: true
                    });
                }
            },
            // 跳转到购物车页面
            openCartPage() {
                wx.switchTab({
                    url: '/pages/cart/cart'
                });
            },
            // 加入购物车，多种判断哦~
            async addToCart() {
                if (this.openAttr === false) {
                    // 打开规格选择弹窗
                    this.openAttr = !this.openAttr;
                } else {
                    // 提示选择完整规格
                    if (!this.isCheckedAllSpec()) {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: '规格选择不完整',
                            mask: true
                        });
                        return false;
                    }
                    // 根据选中的规格，判断是否有对应的sku信息
                    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
                    // console.log('checkedProduct', checkedProduct);
                    // 验证商品型号
                    if (!checkedProduct || checkedProduct.length <= 0) {
                        // 提示没有库存
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: '库存型号不足',
                            mask: true
                        });
                        return false;
                    }
                    // 验证商品数量
                    if (checkedProduct.goods_number < this.number) {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: '库存数量不足',
                            mask: true
                        });
                        return false;
                    }
                    // 添加到购物车
                    const res = await api.CartAdd({
                        goodsId: this.goods.id,
                        number: this.number,
                        productId: checkedProduct[0].id
                    });
                    // console.log('添加到购物车，请求结果', res);
                    if (res.errno === 0) {
                        wx.showToast({
                            title: '添加成功'
                        });
                        this.openAttr = !this.openAttr;
                        this.cartGoodsCount = res.data.cartTotal.goodsCount;
                    } else {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: res.errmsg,
                            mask: true
                        });
                    }
                }
            },
            // 立即购买
            async buyInstant() {
                if (this.openAttr === false) {
                    this.openAttr = !this.openAttr;
                } else {
                    if (!this.isCheckedAllSpec()) {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: '规格选择不完整',
                            mask: true
                        });
                        return false;
                    }
                    // 根据选中的规格，判断是否有对应的sku信息
                    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
                    // console.log('checkedProduct', checkedProduct);
                    // 验证商品型号
                    if (!checkedProduct || checkedProduct.length <= 0) {
                        // 提示没有库存
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: '库存型号不足',
                            mask: true
                        });
                        return false;
                    }
                    // 验证商品数量
                    if (checkedProduct.goods_number < this.number) {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: '库存数量不足',
                            mask: true
                        });
                        return false;
                    }
                    wx.navigateTo({
                        url: '../shopping/checkout?id=' + this.goods.id + '&number=' + this.number +
                            '&productId=' + checkedProduct[0].id+'&isBuy=1'
                    })
                }
            },
            // 减少数量
            cutNumber() {
                this.number = (this.number - 1 > 1) ? this.number - 1 : 1;
            },
            // 增加数量
            addNumber() {
                this.number = this.number + 1;
            },
            // 原生的分享功能
            onShareAppMessage: function() {
                return {
                    title: 'xbyjShop',
                    desc: '仿网易严选小程序商城',
                    path: '/pages/goods/goods'
                }
            }
        }
    }
</script>

<style>
    @import "../../utils/wxParse/wxParse.wxss";

    .container {
        margin-bottom: 100rpx;
    }

    .goodsimgs {
        width: 750rpx;
        height: 750rpx;
    }

    .goodsimgs image {
        width: 750rpx;
        height: 750rpx;
        background-color: #eee;
    }

    .service-policy {
        width: 720rpx;
        height: 73rpx;
        background: #f4f4f4;
        padding: 0 31.25rpx;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
    }

    .service-policy .item {
        background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/servicePolicyRed-518d32d74b.png) 0 center no-repeat;
        background-size: 10rpx;
        padding-left: 15rpx;
        display: flex;
        align-items: center;
        font-size: 25rpx;
        color: #666;
    }

    .goods-info {
        width: 750rpx;
        height: 306rpx;
        overflow: hidden;
        background: #fff;
    }

    .goods-info .c {
        display: block;
        width: 718.75rpx;
        height: 100%;
        margin-left: 31.25rpx;
        padding: 38rpx 31.25rpx 38rpx 0;
        border-bottom: 1px solid #f4f4f4;
    }

    .goods-info .c span {
        display: block;
        width: 687.5rpx;
        text-align: center;
    }

    .goods-info .name {
        height: 41rpx;
        margin-bottom: 5.208rpx;
        font-size: 41rpx;
        line-height: 41rpx;
    }

    .goods-info .desc {
        height: 43rpx;
        margin-bottom: 41rpx;
        font-size: 24rpx;
        line-height: 36rpx;
        color: #999;
    }

    .goods-info .price {
        height: 35rpx;
        font-size: 35rpx;
        line-height: 35rpx;
        color: #b4282d;
    }

    .goods-info .brand {
        margin-top: 23rpx;
        min-height: 40rpx;
        text-align: center;
    }

    .goods-info .brand span {
        display: inline-block;
        width: auto;
        padding: 2px 30rpx 2px 10.5rpx;
        line-height: 35.5rpx;
        border: 1px solid #f48f18;
        font-size: 25rpx;
        color: #f48f18;
        border-radius: 4px;
        background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/detailTagArrow-18bee52dab.png) 95% center no-repeat;
        background-size: 10.75rpx 18.75rpx;
    }

    .section-nav {
        width: 750rpx;
        height: 108rpx;
        background: #fff;
        margin-bottom: 20rpx;
    }

    .section-nav .t {
        float: left;
        width: 600rpx;
        height: 108rpx;
        line-height: 108rpx;
        font-size: 29rpx;
        color: #333;
        margin-left: 31.25rpx;
    }

    .section-nav .i {
        float: right;
        width: 52rpx;
        height: 52rpx;
        margin-right: 16rpx;
        margin-top: 28rpx;
    }

    .section-act .t {
        float: left;
        display: flex;
        align-items: center;
        width: 600rpx;
        height: 108rpx;
        overflow: hidden;
        line-height: 108rpx;
        font-size: 29rpx;
        color: #999;
        margin-left: 31.25rpx;
    }

    .section-act .label {
        color: #999;
    }

    .section-act .tag {
        display: flex;
        align-items: center;
        padding: 0 10rpx;
        border-radius: 3px;
        height: 37rpx;
        width: auto;
        color: #f48f18;
        overflow: hidden;
        border: 1px solid #f48f18;
        font-size: 25rpx;
        margin: 0 10rpx;
    }

    .section-act .span {
        display: flex;
        align-items: center;
        height: 37rpx;
        width: auto;
        overflow: hidden;
        color: #f48f18;
        font-size: 29rpx;
    }

    .comments {
        width: 100%;
        height: auto;
        padding-left: 30rpx;
        background: #fff;
        margin: 20rpx 0;
    }

    .comments .h {
        height: 102.5rpx;
        line-height: 100.5rpx;
        width: 718.75rpx;
        padding-right: 16rpx;
        border-bottom: 1px solid #d9d9d9;
    }

    .comments .h .t {
        display: block;
        float: left;
        width: 50%;
        font-size: 38.5rpx;
        color: #333;
    }

    .comments .h .i {
        display: block;
        float: right;
        width: 164rpx;
        height: 100.5rpx;
        line-height: 100.5rpx;
        background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/address-right-990628faa7.png) right center no-repeat;
        background-size: 52rpx;
    }

    .comments .b {
        height: auto;
        width: 720rpx;
    }

    .comments .item {
        height: auto;
        width: 720rpx;
        overflow: hidden;
    }

    .comments .info {
        height: 127rpx;
        width: 100%;
        padding: 33rpx 0 27rpx 0;
    }

    .comments .user {
        float: left;
        width: auto;
        height: 67rpx;
        line-height: 67rpx;
        font-size: 0;
    }

    .comments .user image {
        float: left;
        width: 67rpx;
        height: 67rpx;
        margin-right: 17rpx;
        border-radius: 50%;
    }

    .comments .user span {
        display: inline-block;
        width: auto;
        height: 66rpx;
        overflow: hidden;
        font-size: 29rpx;
        line-height: 66rpx;
    }

    .comments .time {
        display: block;
        float: right;
        width: auto;
        height: 67rpx;
        line-height: 67rpx;
        color: #7f7f7f;
        font-size: 25rpx;
        margin-right: 30rpx;
    }

    .comments .content {
        width: 720rpx;
        padding-right: 30rpx;
        line-height: 45.8rpx;
        font-size: 29rpx;
        margin-bottom: 24rpx;
    }

    .comments .imgs {
        width: 720rpx;
        height: auto;
        margin-bottom: 25rpx;
    }

    .comments .imgs .img {
        height: 150rpx;
        width: 150rpx;
        margin-right: 28rpx;
    }

    .comments .spec {
        width: 720rpx;
        padding-right: 30rpx;
        line-height: 30rpx;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 30rpx;
    }

    .goods-attr {
        width: 750rpx;
        height: auto;
        overflow: hidden;
        padding: 0 31.25rpx 25rpx 31.25rpx;
        background: #fff;
    }

    .goods-attr .t {
        width: 687.5rpx;
        height: 104rpx;
        line-height: 104rpx;
        font-size: 38.5rpx;
        margin-left: 10rpx;
    }

    .goods-attr .item {
        width: 687.5rpx;
        height: 68rpx;
        padding: 11rpx 20rpx;
        margin-bottom: 11rpx;
        background: #f7f7f7;
        font-size: 38.5rpx;
        margin-left: 10rpx;
    }

    .goods-attr .left {
        float: left;
        font-size: 25rpx;
        width: 134rpx;
        height: 45rpx;
        line-height: 45rpx;
        overflow: hidden;
        color: #999;
    }

    .goods-attr .right {
        float: left;
        font-size: 36.5rpx;
        margin-left: 20rpx;
        width: 480rpx;
        height: 45rpx;
        line-height: 45rpx;
        overflow: hidden;
        color: #333;
    }

    .wxParse image {
        margin-bottom: -15rpx;
    }

    .detail {
        width: 750rpx;
        height: auto;
        overflow: hidden;
    }

    .detail image {
        width: 750rpx;
        display: block;
    }

    .common-problem {
        width: 750rpx;
        height: auto;
        overflow: hidden;
    }

    .common-problem .h {
        position: relative;
        height: 145.5rpx;
        width: 750rpx;
        padding: 56.25rpx 0;
        background: #fff;
        text-align: center;
    }

    .common-problem .h .line {
        display: inline-block;
        position: absolute;
        top: 72rpx;
        left: 0;
        z-index: 2;
        height: 1px;
        margin-left: 225rpx;
        width: 300rpx;
        background: #ccc;
    }

    .common-problem .h .title {
        display: inline-block;
        position: absolute;
        top: 56.125rpx;
        left: 0;
        z-index: 3;
        height: 33rpx;
        margin-left: 285rpx;
        width: 180rpx;
        background: #fff;
    }

    .common-problem .b {
        width: 720rpx;
        height: auto;
        overflow: hidden;
        padding: 0rpx 30rpx;
        background: #fff;
    }

    .common-problem .item {
        height: auto;
        overflow: hidden;
        padding-bottom: 25rpx;
    }

    .common-problem .question-box .spot {
        float: left;
        display: block;
        height: 8rpx;
        width: 8rpx;
        background: #b4282d;
        border-radius: 50%;
        margin-top: 11rpx;
    }

    .common-problem .question-box .question {
        /* float: left; */
        line-height: 30rpx;
        padding-left: 20rpx;
        display: block;
        font-size: 26rpx;
        padding-bottom: 15rpx;
        color: #303030;
    }

    .common-problem .answer {
        line-height: 36rpx;
        padding-left: 16rpx;
        font-size: 26rpx;
        color: #787878;
    }

    .related-goods {
        width: 750rpx;
        height: auto;
        overflow: hidden;
    }

    .related-goods .h {
        position: relative;
        height: 145.5rpx;
        width: 750rpx;
        padding: 56.25rpx 0;
        background: #fff;
        text-align: center;
        border-bottom: 1px solid #f4f4f4;
    }

    .related-goods .h .line {
        display: inline-block;
        position: absolute;
        top: 72rpx;
        left: 0;
        z-index: 2;
        height: 1px;
        margin-left: 225rpx;
        width: 300rpx;
        background: #ccc;
    }

    .related-goods .h .title {
        display: inline-block;
        position: absolute;
        top: 56.125rpx;
        left: 0;
        z-index: 3;
        height: 33rpx;
        margin-left: 285rpx;
        width: 200rpx;
        background: #fff;
    }

    .related-goods .b {
        width: 750rpx;
        height: auto;
        overflow: hidden;
    }

    .related-goods .b .item {
        float: left;
        background: #fff;
        width: 312rpx;
        height: auto;
        overflow: hidden;
        text-align: center;
        padding: 15rpx 31.25rpx;
        border-right: 1px solid #f4f4f4;
        border-bottom: 1px solid #f4f4f4;
    }

    .related-goods .item .img {
        width: 311.45rpx;
        height: 311.45rpx;
    }

    .related-goods .item .name {
        display: block;
        width: 311.45rpx;
        height: 35rpx;
        margin: 11.5rpx 0 15rpx 0;
        text-align: center;
        overflow: hidden;
        font-size: 30rpx;
        color: #333;
    }

    .related-goods .item .price {
        display: block;
        width: 311.45rpx;
        height: 30rpx;
        text-align: center;
        font-size: 30rpx;
        color: #b4282d;
    }

    .bottom-btn {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        width: 750rpx;
        height: 100rpx;
        display: flex;
        background: #fff;
    }

    .bottom-btn .l {
        float: left;
        height: 100rpx;
        width: 162rpx;
        border: 1px solid #f4f4f4;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bottom-btn .l.l-collect {
        border-right: none;
        border-left: none;
        text-align: center;
    }

    .bottom-btn .l.l-cart .box {
        position: relative;
        height: 60rpx;
        width: 60rpx;
    }

    .bottom-btn .l.l-cart .cart-count {
        height: 28rpx;
        width: 28rpx;
        z-index: 10;
        position: absolute;
        top: 0;
        right: 0;
        background: #b4282d;
        text-align: center;
        font-size: 18rpx;
        color: #fff;
        line-height: 28rpx;
        border-radius: 50%;
    }

    .bottom-btn .l.l-cart .icon {
        position: absolute;
        top: 10rpx;
        left: 0;
    }

    .bottom-btn .l .icon {
        display: block;
        height: 44rpx;
        width: 44rpx;
    }

    .bottom-btn .c {
        float: left;
        height: 100rpx;
        line-height: 96rpx;
        flex: 1;
        text-align: center;
        color: #333;
        border-top: 1px solid #f4f4f4;
        border-bottom: 1px solid #f4f4f4;
    }

    .bottom-btn .r {
        border: 1px solid #b4282d;
        background: #b4282d;
        float: left;
        height: 100rpx;
        line-height: 96rpx;
        flex: 1;
        text-align: center;
        color: #fff;
    }

    .attr-pop-box {
        width: 100%;
        height: 100%;
        position: fixed;
        background: rgba(0, 0, 0, .5);
        z-index: 8;
        bottom: 0;
        /* display: none; */
    }

    .attr-pop {
        width: 100%;
        height: auto;
        max-height: 780rpx;
        padding: 31.25rpx;
        background: #fff;
        position: fixed;
        z-index: 9;
        bottom: 100rpx;
        overflow-y: auto;
    }

    .attr-pop .close {
        position: absolute;
        width: 48rpx;
        height: 48rpx;
        right: 80rpx;
        overflow: hidden;
        top: 31.25rpx;
    }

    .attr-pop .close .icon {
        width: 48rpx;
        height: 48rpx;
    }

    .attr-pop .img-info {
        width: 687.5rpx;
        height: 177rpx;
        overflow: hidden;
        margin-bottom: 41.5rpx;
    }

    .attr-pop .img {
        float: left;
        height: 177rpx;
        width: 177rpx;
        background: #f4f4f4;
        margin-right: 31.25rpx;
    }

    .attr-pop .info {
        float: left;
        height: 177rpx;
        width: 440rpx;
        display: flex;
        align-items: center;
    }

    .attr-pop .p {
        font-size: 33rpx;
        color: #333;
        height: 33rpx;
        line-height: 33rpx;
        margin-bottom: 10rpx;
    }

    .attr-pop .a {
        font-size: 29rpx;
        color: #333;
        height: 40rpx;
        line-height: 40rpx;
    }

    .spec-con {
        width: 100%;
        height: auto;
        overflow: hidden;
    }

    .spec-con .name {
        height: 32rpx;
        margin-bottom: 22rpx;
        font-size: 29rpx;
        color: #333;
    }

    .spec-con .values {
        height: auto;
        margin-bottom: 31.25rpx;
        font-size: 0;
    }

    .spec-con .value {
        display: inline-block;
        height: 62rpx;
        padding: 0 35rpx;
        line-height: 56rpx;
        text-align: center;
        margin-right: 25rpx;
        margin-bottom: 16.5rpx;
        border: 1px solid #333;
        font-size: 25rpx;
        color: #333;
    }

    .spec-con .value.disable {
        border: 1px solid #ccc;
        color: #ccc;
    }

    .spec-con .value.selected {
        border: 1px solid #b4282d;
        color: #b4282d;
    }

    .number-item .selnum {
        width: 322rpx;
        height: 71rpx;
        border: 1px solid #ccc;
        display: flex;
    }

    .number-item .cut {
        width: 93.75rpx;
        height: 100%;
        text-align: center;
        line-height: 65rpx;
    }

    .number-item .number {
        flex: 1;
        height: 100%;
        text-align: center;
        line-height: 68.75rpx;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        float: left;
    }

    .number-item .add {
        width: 93.75rpx;
        height: 100%;
        text-align: center;
        line-height: 65rpx;
    }
</style>
