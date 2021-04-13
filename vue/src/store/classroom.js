import http from "../utils/http";

export default {
        namespaced: true,
        state: {
                classrooms: [],
                isInit: false
        },
        mutations: {
                _init(state, classrooms) {
                        state.classrooms = classrooms;
                        state.isInit = true;
                },
                _removeClassroom(state, clsr_id) {
                        let i = state.classrooms.findIndex(item => item.clsr_id === clsr_id);
                        state.classrooms.splice(i, 1)
                },
                _addClassroom(state, classroom) {
                        state.classrooms.push(classroom)
                },
                _updateClassroom(state, classroom) {
                        let i = state.classrooms.findIndex(item => item.clsr_id === classroom.clsr_id);
                        state.classrooms.splice(i, 1, classroom)
                },
        },
        actions: {
                async init(context) {
                        if(context.state.isInit) return;
                        let classrooms = await http({url: "/classroom/all"});
                        context.commit("_init",classrooms);
                },
                async removeClassroom(context, clsr_id) {
                        await http({url: "/classroom/remove/" + clsr_id})
                        context.commit("_removeClassroom",clsr_id);
                },
                async addClassroom(context, classroom) {
                        classroom.clsr_id = await http({url: "/classroom/add", method: "post", data: classroom});
                        context.commit("_addClassroom", classroom);
                },
                async updateClassroom(context, classroom) {
                        await http({url: "/classroom/update", method: "post", data: classroom});
                        context.commit("_updateClassroom", classroom);
                },
        }
}