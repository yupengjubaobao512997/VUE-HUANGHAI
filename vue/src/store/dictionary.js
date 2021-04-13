import http from "../utils/http"


export default {
        namespaced: true,
        state:{
                dtList:[],
                isInit: false
        },
        getters: {
                stfDtList(state) {
                        // let result = [];
                        // state.dtList.filter(item => item.dic_group_key === "staff_category").forEach(item => {
                        //         let node = Object.assign({}, item);
                        //         result.push(node)
                        // });
                        // return result;
                        return function(groupKey){
                                return state.dtList.filter(item => item.dic_group_key === groupKey)

                        }
                }
        },
        mutations: {
                _init(state,dtList) {
                        state.dtList = dtList;
                        state.isInit = true;
                },
        },
        actions: {
                async init({state,commit}) {
                        if(state.isInit) return;
                        let dtList = await http({url: "/dictionary/all"});
                        commit('_init', dtList);
                }
        }
}