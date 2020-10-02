import Vue from 'vue'
import Router from 'vue-router'
import Index from "../components/Index";
import Login from "../components/Login";
import Register from "../components/Register";
import Course from "../components/Course";
import CourseDetail from "../components/CourseDetail";


Vue.use(Router)

export default new Router({
    routes: [
        {path: '/', component: Index},
        {path: '/index', component: Index},
        {path: '/login', component: Login},
        {path: '/login', component: Login},
        {path: '/register', component: Register},
        {path: '/course', component: Course},
        {path: '/detail/:id', component: CourseDetail},
    ]
})
