import { getBlogPosts } from "./data";
// import "./style.css";
// import babyImage from "./assets/image/022.jpg";
import {createApp} from "vue";
import App from "./app.vue"
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as _ from "lodash";
// import moment from 'moment';
const MyVue = createApp(App);
MyVue.use(ElementPlus);
MyVue.mount("#main");
const blogList = _.uniq(getBlogPosts());
console.log(blogList)