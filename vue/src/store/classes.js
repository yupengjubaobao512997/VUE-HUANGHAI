import http from "../utils/http";

export default {
        namespace:true,
        state: {
                classList: [],
                isInit: false
        },
        getters: {},
        mutations: {
                _init(state, list) {
                        state.classList = list;
                        state.isInit = true;
                },
        },
        actions: {
                async init({state, commit}) {
                        if(state.isInit) return
                        let list = await http({url: "/class/all"});
                        commit("_init", list);
                }
        }
}