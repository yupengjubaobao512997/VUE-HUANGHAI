import http from "../utils/http.js";
import Vue from "vue";
import Vuex from "vuex";
import func from "./func";
import role from "./role";
import classroom from "./classroom";
import dictionary from "./dictionary";
import classes from "./classes";

Vue.use(Vuex);

let store = new Vuex.Store({
        modules: {
                func,
                role,
                classroom,
                dictionary,
                classes,
        },
        state: {http},
        getters: {},
        mutations: {
                changeNum(state, num) {
                        state.num -= num[0];
                },
        },
        actions:{},
});

export default store;