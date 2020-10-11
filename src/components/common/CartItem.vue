<template>
    <div class="cart_item">
        <div class="cart_column column_1">
            <el-checkbox class="my_el_checkbox" v-model="course.selected"></el-checkbox>
        </div>
        <div class="cart_column column_2">
            <img :src="course.course_img" alt="">
            <span><router-link :to="'/detail/'+course.id">{{course.name}}</router-link></span>
        </div>
        <div class="cart_column column_3">
            <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select">
                <el-option :label="item.expire_text" :value="item.id" :key="item.id"
                           v-for="item in course.expire_list"></el-option>
            </el-select>
        </div>
        <div class="cart_column column_4">¥{{course.real_price}}</div>
        <div class="cart_column column_4" >
            <el-button type="danger" @click="del_course(course.id)">删除</el-button>

        </div>
    </div>
</template>

<script>
    export default {
        name: "CartItem",
        props: ['course', 'checkall'],
        data() {
            return {
                expire: 0,
                allcheck: this.allcheck,
                checked: this.course.selected,
                cart_list:[],
            }
        },
        watch: {
            // 通过监测课程id来切换有效期
            'course.expire_id': function () {
                // 后台发送请求切换状态
                this.change_expire();
            },
            // 通过监测select的变化来改变当前的选中状态
            'course.selected': function () {
                // 后台发送请求切换状态
                this.change_select()
            },
            allcheck(){
                console.log(this.allcheck);
                this.checked = this.allcheck
            }
        },
        methods:{
            check_user_login (){
                let token = sessionStorage.token;
                if(!token){
                    this.$router.push('/login');
                    return false
                }
                return token
            },
            change_select(){
                let token = this.check_user_login();
                this.$axios({
                    url: this.$settings.HOST + 'cart/option/',
                    method: 'post',
                    data: {
                        course_id: this.course.id,
                        select: this.course.selected,
                    },
                    headers: {
                        // 提交购物车时必须携带token  jwt 后必须跟空格
                        "Authorization": "jwt " + token,
                    }
                }).then(res => {
                    console.log(res);
                    this.$emit("change_select");
                }).catch(error => {
                    console.log(error);
                })
            },
            del_course(id){
                let token = this.check_user_login();
                // this.$axios({
                //     url:this.$settings.HOST + "cart/delete/",
                //     method: 'get',
                //     params: {
                //         course_id: id,
                //     },
                //     headers: {
                //         // 提交购物车时必须携带token  jwt 后必须跟空格
                //         "Authorization": "jwt " + token,
                //     }
                // }).then(res => {
                //     // console.log(res, 22222);
                //     this.cart_list = res.data;
                //     localStorage.setItem('cart_length', res.data.length)
                //     alert('删除成功');
                // }).catch(error => {
                //     console.log(error);
                // })
                this.$axios.delete(this.$settings.HOST + 'cart/option/', {
                    params: {
                        "course_id": this.course.id,
                    },
                    headers: {
                        "Authorization": "jwt " + token,
                    }
                }).then(response => {
                    this.$message.success(response.data.message)

                    // 当自组价删除商品时需要通知父组件来执行对应的方法  可以向父组件提交事件
                    this.$emit("del_course");

                }).catch(error => {
                    this.$message.success(error.data.message)
                })
            },
            change_expire() {
                let token = this.check_user_login();
                this.$axios.put(this.$settings.HOST + "cart/option/", {
                    course_id: this.course.id,
                    expire_id: this.course.expire_id,
                }, {
                    headers: {
                        // 提交购物车时必须携带token  jwt 后必须跟空格
                        "Authorization": "jwt " + token,
                    }
                }).then(response=>{
                    this.$message.success(response.data.message)
                    // console.log(response.data);
                    // 改变价格
                    this.course.real_price = response.data.price;
                }).catch(error=>{
                    console.log(error);
                })
            },
        },
    }
</script>

<style scoped>
    .cart_item::after {
        content: "";
        display: block;
        clear: both;
    }

    .cart_column {
        float: left;
        height: 250px;
    }

    .cart_item .column_1 {
        width: 88px;
        position: relative;
    }

    .my_el_checkbox {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 16px;
        height: 16px;
    }

    .cart_item .column_2 {
        padding: 67px 10px;
        width: 520px;
        height: 116px;
    }

    .cart_item .column_2 img {
        width: 175px;
        height: 115px;
        margin-right: 35px;
        vertical-align: middle;
    }

    .cart_item .column_3 {
        width: 197px;
        position: relative;
        padding-left: 10px;
    }

    .my_el_select {
        width: 117px;
        height: 28px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
    }

    .cart_item .column_4 {
        padding: 67px 10px;
        height: 116px;
        width: 142px;
        line-height: 116px;
    }

</style>
