<template>
    <div class="cart">
        <Header></Header>
        <div class="cart_info">
            <div class="cart_title">
                <span class="text">我的购物车</span>
                <span class="total">共{{cart_list.length}}门课程</span>
            </div>
            <div class="cart_table">
                <div class="cart_head_row">
                    <span class="doing_row"></span>
                    <span class="course_row">课程</span>
                    <span class="expire_row">有效期</span>
                    <span class="price_row">单价</span>
                    <span class="do_more">操作</span>
                </div>
                <div class="cart_course_list">
                    <CartItem v-for="(course, key) in cart_list" :course = course
                              @del_course="del_cart(key)" @change_select="cart_total_price"></CartItem>
                </div>
                <div class="cart_footer_row">
                    <span class="cart_select">
                        <label>
                            <el-checkbox v-model="checked"></el-checkbox> &nbsp;
                            <span>全选</span>
                        </label>
                    </span>
                    <span class="cart_delete"><i class="el-icon-delete"></i> <span>删除</span></span>
                    <span class="goto_pay" @click="pay_order">去结算</span>
<!--                    <router-link class="goto_pay" to="/order">去结算</router-link>-->
                    <span class="cart_total">总计：¥{{total_price.toFixed(2)}}</span>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Footer from "./common/Footer";
    import Header from "./common/Header";
    import CartItem from "./common/CartItem";

    export default {
        name: "Cart",
        data(){
          return {
              checked: false,
              cart_list: [],
              total_price: 0,
          }
        },
        // watch: {
        //     cart_list(){
        //         this.get_cart();
        //     }
        // },
        methods: {
            check_user_login (){
                let token = sessionStorage.token;
                if(!token){
                    this.$router.push('/login');
                    return false
                }
                return token
            },
            all_checked(){
                this.checked = !this.checked;
            },
            get_cart() {
                // 获取购物车前判断用户
                let token = this.check_user_login()
                this.$axios.get(this.$settings.HOST + "cart/option/", {
                    headers: {
                        // 提交购物车时必须携带token  jwt 后必须跟空格
                        "Authorization": "jwt " + token,
                    }
                }).then(res => {
                    // console.log(res, 11111);
                    this.cart_list = res.data;
                }).catch(error => {
                    console.log(error);
                })
            },
            del_cart(key) {
                // 从购物车中移除掉某个课程
                this.cart_list.splice(key, 1);
                // 删除后向store提交动作来修改购物车总数量
                this.$store.commit("add_cart", this.cart_list.length)
            },
            // 计算购物车商品总价
            cart_total_price() {
                let total = 0;
                this.cart_list.forEach((course, key) => {
                    // 判断商品是否选中了，如果商品选中了则计入总价  没选中则不计入
                    if (course.selected) {
                        total += parseFloat(course.real_price)
                    }
                    console.log(total);
                    this.total_price = total;
                })
            },
            pay_order(){
                let count = 0
                this.cart_list.forEach(course => {
                    if (course.selected) {
                        count += 1
                    }
                })
                let cart_length = localStorage.getItem('cart_length') - count
                localStorage.setItem('cart_length', cart_length);
                this.$store.commit("add_cart", cart_length);
                this.$router.push('/order');
            }
        },
        created() {
          this.get_cart();
          this.cart_total_price();
        },
        components: {
            Footer,
            Header,
            CartItem
        },
    }
</script>

<style scoped>
    .cart_info {
        width: 1200px;
        margin: 0 auto 200px;
    }

    .cart_title {
        margin: 25px 0;
    }

    .cart_title .text {
        font-size: 18px;
        color: #666;
    }

    .cart_title .total {
        font-size: 12px;
        color: #d0d0d0;
    }

    .cart_table {
        width: 1170px;
    }

    .cart_table .cart_head_row {
        background: #F7F7F7;
        width: 100%;
        height: 80px;
        line-height: 80px;
        padding-right: 30px;
    }

    .cart_table .cart_head_row::after {
        content: "";
        display: block;
        clear: both;
    }

    .cart_table .cart_head_row .doing_row,
    .cart_table .cart_head_row .course_row,
    .cart_table .cart_head_row .expire_row,
    .cart_table .cart_head_row .price_row,
    .cart_table .cart_head_row .do_more {
        padding-left: 10px;
        height: 80px;
        float: left;
    }

    .cart_table .cart_head_row .doing_row {
        width: 78px;
    }

    .cart_table .cart_head_row .course_row {
        width: 530px;
    }

    .cart_table .cart_head_row .expire_row {
        width: 188px;
    }

    .cart_table .cart_head_row .price_row {
        width: 162px;
    }

    .cart_table .cart_head_row .do_more {
        width: 162px;
    }

    .cart_footer_row {
        padding-left: 30px;
        background: #F7F7F7;
        width: 100%;
        height: 80px;
        line-height: 80px;
    }

    .cart_footer_row .cart_select span {
        margin-left: -7px;
        font-size: 18px;
        color: #666;

    }

    .cart_footer_row .cart_select input {
        width: 16px;
        height: 16px;
    }

    .cart_footer_row .cart_delete {
        margin-left: 58px;
    }

    .cart_delete .el-icon-delete {
        font-size: 18px;
    }

    .cart_delete span {
        margin-left: 15px;
        cursor: pointer;
        font-size: 18px;
        color: #666;
    }

    .cart_total {
        float: right;
        margin-right: 62px;
        font-size: 18px;
        color: #666;
    }

    .goto_pay {
        float: right;
        width: 159px;
        height: 80px;
        outline: none;
        border: none;
        background: #ffc210;
        font-size: 18px;
        color: #fff;
        text-align: center;
        cursor: pointer;
    }
</style>
