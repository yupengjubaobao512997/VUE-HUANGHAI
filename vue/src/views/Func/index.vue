<template>
	<div>
		<!--树形控件 静态->动态 -->
		<el-tree :data="dataTree" class="custom-tree" default-expand-all :expand-on-click-node="false">
			<span class="custom-tree-node" slot-scope="{node, data }">
				<span v-text="data.func_name"
				      :class="{root: data.func_id === 0, unLeaf: data.func_key === '', leaf: data.func_key !== ''}"></span>
				<span>
					<el-button type="text" v-if="data.func_key ===''" @click="beginAdd(data)"><i
						class="el-icon-plus"></i></el-button>
					<el-button type="text" v-if="data.func_id !== 0" @click="beginUndate(data)"><i
						class="el-icon-edit"></i></el-button>
					<el-button type="text" v-if="[0, 44, 45].indexOf(data.func_id) === -1"
					           :disabled="!!data.children"
					           @click="remove(data)">
						<i class="el-icon-delete"></i>
					</el-button>
				</span>
			</span>
		</el-tree>
		<el-dialog :modal="false" :title="edit.mode? '系统维护功能-新增' : '系统维护功能-修改'" :visible.sync="edit.isEdit"
		           width="600px" :before-close="handleClose">
			<el-form :model="edit.model" label-width="120px" :rules="edit.rules" ref="form">
				<el-form-item label="节点类型：">
					<el-radio :disabled="!(edit.mode&&edit.model.func_fid === 0)"
					          v-model="edit.isLeaf" :label="true">叶子结点
					</el-radio>
					<el-radio :disabled="!(edit.mode&&edit.model.func_fid === 0)"
					          v-model="edit.isLeaf" :label="false">非叶子节点
					</el-radio>
				</el-form-item>
				<el-form-item label="父亲节点名称：" label-width="120px" v-show="edit.mode">
					<el-select v-model="edit.model" :value="edit.model"
					           :disabled="edit.mode || !edit.isLeaf ">
						<el-option v-for="item in selectData" :key="item.value"
						           :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="功能名称：" prop="func_name">
					<el-input v-model.trim="edit.model.func_name" placeholder="请输入功能名称"></el-input>
				</el-form-item>
				<el-form-item label="绑定组件：" v-show="edit.isLeaf" prop="func_key">
					<el-select v-model="edit.model.func_key">
						<el-option
							v-for="item in Object.keys(views)"
							:key="item"
							:label="item"
							:value="item"
							:disabled="list.findIndex(func => func.func_key === item) !== -1">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="edit.isEdit =false">取  消</el-button>
				<el-button type="primary" @edit="edit.isEdit =false" @click="save">确  认</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
        import views from "../../views"
	import {createNamespacedHelpers} from"vuex"
        let {mapState, mapGetters ,mapActions} = createNamespacedHelpers("func");
        export default {
                name: "Func",
                data(){
                        return {
                                views,
                                edit: {
                                        isEdit: false,                 //标识是否进入标记状态
                                        isLeaf: true,                   //标识当前编辑是否是叶子结点
                                        mode: true,                   //true表示新增，false表示修改
                                        model: {func_id: 0, func_name: "", func_key: "", func_fid: -1},
                                        rules: {
                                                func_name: [
                                                        {
                                                                validator: (rule, value, callback) =>{
                                                                        let {func_id, func_name, func_fid} = this.edit.model;
                                                                        if(value.length === 0)
                                                                                callback(new Error("* 功能名称不能为空"));
                                                                        else if(value.length < 2 || value.length > 50)
                                                                                callback(new Error("* 功能名长度2-50"));
                                                                        else if(this.list.some(item => item.func_id !== func_id && item.func_name === func_name && item.func_fid === func_fid))
                                                                                callback(new Error("*功能已在当前父级中已经存在"))
                                                                        else
                                                                                callback();
                                                                },
                                                                trigger: "blur",
                                                        }
                                                ],
                                                func_key: [
                                                        {
                                                                validator: (rule, value, callback) =>{
                                                                        if(this.edit.mode && this.edit.isLeaf && value === "")
                                                                                callback(new Error("* 叶子节点，必须绑定组件"));
                                                                        else
                                                                                callback();

                                                                },

                                                        }
                                                ]


                                        }
                                },
                        };
                },
                computed: {
	                ...mapState(["list"]),
	                ...mapGetters(["listToTree"]),
                        dataTree(){
                                let result = [
                                        {
                                                func_id: 0,
                                                func_name: "Root",
                                                func_key: "",
                                                func_fid: -1,
                                                children:this.listToTree
//                                                children: this.$store.getters["/func/listToTree"]
                                        }]//存放转换为树形结构的数据
                                return result;
                        },
                        selectData(){
                                let result = [{label: "Root", value: 0}];
                                this.list.filter(item => item.func_key === "").forEach(item =>{
                                        result.push({label: item.func_name, value: item.func_id})
                                });
                                return result;
                        },

                },
                created(){
//                        this.$store.dispatch("func/init");
	                this.init()
                },
                methods: {
	                ...mapActions(["init", "removeFunc", "addFunc", "updateFunc"]),
                        remove(node){
                                this.$confirm(`确定要删除"${node.func_name}"节点吗`, "警告", {type: "warning"})
                                        .then(async() =>{
                                                await this.removeFunc(node.func_id);
//                                                await this.$store.dispatch("func/removeFunc", node.func_id);
                                                this.$message({
                                                        message: `"${node.func_name}"节点，删除成功！ 请刷新页面，启用新菜单。。`,
                                                        type: "success",
                                                });
                                        })
                                        .catch(() =>{
                                        })
                        },
                        beginAdd(parentNode){
                                this.$refs.form && this.$refs.form.resetFields();               //重置表单
                                //打开对话框前的准备工作
                                this.edit.mode = true;
                                this.edit.isLeaf = parentNode.func_id !== 0;
                                this.edit.model.func_id = 0;
                                this.edit.model.func_name = "";
                                this.edit.model.func_key = "";
                                this.edit.model.func_fid = parentNode.func_id;
                                this.edit.isEdit = true;

                        },
                        beginUndate(node){
                                this.$refs.form && this.$refs.form.resetFields();                //重置表单
                                this.edit.mode = false;
                                this.edit.isLeaf = node.func_key !== "";
                                this.edit.model.func_id = node.func_id;
                                this.edit.model.func_name = node.func_name;
                                this.edit.model.func_key = node.func_key;
                                this.edit.model.func_fid = node.func_fid;
                                this.edit.isEdit = true;

                        },
                        handleClose(done){
                                this.$confirm('确认关闭？')
                                        .then(_ =>{
                                                done();
                                        })
                                        .catch(_ =>{
                                        });
                        },
                        save(){
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        if(this.edit.mode){
                                                await this.addFunc(Object.assign({}, this.edit.model));
//                                                await this.$store.dispatch("func/addFunc", Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: "节点，添加成功！ 请刷新页面，启用新菜单。。",
                                                        type: "success",
                                                });
                                        }else{
                                                await this.updateFunc(Object.assign({}, this.edit.model));
//                                                await this.$store.dispatch("func/updateFunc", Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: "节点，修改成功！ 请刷新页面，启用新菜单。。",
                                                        type: "success",
                                                });
                                        }
                                        this.edit.isEdit = false;                       //关闭编辑对话框
                                });
                        }
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.custom-tree
		width: 500px;
		span.custom-tree-node
			flex: 1
			display: flex
			align-items: center
			justify-content: space-between
			span.root
				color: brown !important
				font-weight 600
				span.unLeaf
					color: #2a1d57
</style>