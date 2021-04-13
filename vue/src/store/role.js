import http from "../utils/http";

export default {
        namespaced: true,
        state: {
                roles: [],
                isInit: false
        },
        mutations: {
                _init(state, roles) {
                        state.roles = roles;
                        state.isInit = true;
                },
                _removeRole(state, role_id) {
                        let i = state.roles.findIndex(item => item.role_id === role_id);
                        state.roles.splice(i, 1)
                },
                _addRole(state, role) {
                        state.roles.push(role)
                },
                _updateRole(state, role) {
                        let i = state.roles.findIndex(item => item.role_id === role.role_id);
                        state.roles.splice(i, 1, role)
                },
        },
        actions: {
                async init(context) {
                        if(context.state.isInit) return;
                        let roles = await http({url: "/role/all"})
                        console.log(roles);
                        context.commit("_init",roles);
                },
                async removeRole(context, role_id) {
                        await http({url: "/role/remove/" + role_id, method: "post"})
                        context.commit("_removeRole",role_id)
                },
                async addRole(context, role) {
                        role.role_id = await http({url: "/role/add", method: "post", data: role});
                        context.commit("_addRole", role);
                },
                async updateRole(context, role) {
                        await http({url: "/role/update", method: "post", data: role});
                        context.commit("_updateRole", role);
                },
        }
}