<template>
    <div>
        <Header></Header>
        <Banner></Banner>
        <Footer></Footer>
    </div>
</template>

<script>
    import Header from "./common/Header";
    import Footer from "./common/Footer";
    import Banner from "./common/Banner";

    export default {
        name: "Index",
        methods: {
            get_index(){
                let cart_length = localStorage.getItem('cart_length');
                this.$store.commit("add_cart", cart_length);
            }
        },
        created() {
            this.get_index();
        },
        components:{
            Header,
            Footer,
            Banner,

        }
    }
</script>

<style scoped>

</style>
