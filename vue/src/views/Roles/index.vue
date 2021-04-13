<template>
	<div>
		<el-row :gutter="20">
			<el-col v-for="item in roles" :key="item.role_id" :span="6">
				<el-card shadow="hover">
					<span v-text="item.role_name"></span>
					<div class="button-wrapper" >
						<el-button type="text" @click="beginUndate(item)">
							<i class="el-icon-edit"></i>
						</el-button>
						<el-button type="text" @click="remove(item)">
							<i class="el-icon-delete"></i>
						</el-button>
						<el-button type="text" @click="beginRoleFuncConfig(item.role_id)">
							功能分配
						</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card  shadow="hover">
					<div class="add-btn" @click="beginAdd">
						<i class="el-icon-plus"></i>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog :modal="false" :title="edit.mode? '角色维护功能-新增' : '角色维护功能-修改'"  :visible.sync="edit.isEdit" width="600px" :before-close="handleClose">
			<el-form :model="edit.model" label-width="120px" ref="form" :rules="edit.rules">
				<el-form-item label="角色名称：" prop="role_name">
					<el-input v-model.trim="edit.model.role_name" placeholder="请输入角色名称"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="edit.isEdit =false" >取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
		<el-drawer class="custom-drawer"
		           :modal="false"
		           :visible.sync="editfr.isEdit"
		           :showClose="false">
			<h3 slot="title">角色功能分配</h3>
			<el-tree class="custom-tree" :data="editfr.treeData" default-expand-all :expand-on-click-node="false">
				<span class="custom-tree-node"  slot-scope="{node, data}" :class="{parent: data.func_key === ''}">
					<span>
						<i v-if="data.func_key !== ''" class="el-icon-paperclip"></i>
						<span v-text="data.func_name"></span>
						<span class="switch-warpper">
							<el-switch v-model="data.open" @change="switchChangeHandler(data)"
							></el-switch>
						</span>
					</span>
				</span>
			</el-tree>
			<div class="drawerFooter">
				<el-button @click="editfr.isEdit = false">取消</el-button>
				<el-button type="primary" @click="roleFuncConfig">确定</el-button>

			</div>
		</el-drawer>
	</div>
</template>

<script type="text/ecmascript-6">
        import { createNamespacedHelpers } from "vuex";
        let {mapState: mapStateRole, mapActions: mapActionsRole } = createNamespacedHelpers("role");
        let {mapGetters: mapGettersFunc ,mapActions: mapActionsFunc } = createNamespacedHelpers("func");

        export default {
                name: "Role",
                data(){
                        return {
	                        edit: {
                                        isEdit: false,
		                        mode: true,
		                        model: {role_id: -1, role_name: ""},
		                        rules: {
                                                role_name: [
	                                                {
	                                                        validator: (rule, value, callback) =>{
	                                                                let { role_name} =this.edit.model;
	                                                                if(value.length === 0)
	                                                                        callback(new Error("* 角色名不能为空"));
	                                                                else if(value.length <  2 || value.length > 50)
	                                                                        callback(new Error("* 角色名长度2-50"));
		                                                        else if(this.roles.some(item => item.role_name === role_name))
                                                                                callback(new Error("* 角色名已存在"));
		                                                        else
		                                                                callback();
	                                                        },
                                                                trigger: "blur",
	                                                }
                                                ],
		                        }
	                        },
	                        editfr: {
	                                isEdit: false,
					model:{role_id: 0, role_func_ids: ""},
		                        treeData:[]
	                        }
                        }
                },
	        computed: {
		        ...mapStateRole(["roles"]),
                        ...mapGettersFunc(["listToTree"]),
	        },
	        created() {
                        this.init();
                        this.initFunc();
                },
	        methods: {
		        ...mapActionsRole(['init', "removeRole", "addRole", "updateRole" ]),
		        ...mapActionsFunc({initFunc: "init"}),
			updateTreeData(roleFuncIds){
		                let result = JSON.parse(JSON.stringify( this.listToTree));
				result.forEach(item => {
				        console.log(roleFuncIds);

				        item.open = roleFuncIds.indexOf(item.func_id) !== -1;
				        item.children && item.children.forEach(item2 => item2.open = (roleFuncIds.indexOf(item2.func_id)!== -1));
				});
				this.editfr.treeData = result;
				console.log(this.editfr.treeData);
			},
                        remove(node) {
                                this.$confirm(`确定要删除"${node.role_name}"角色吗`,"警告", { type: "warning"})
	                                .then(async () =>{
	                                        await this.removeRole( node.role_id);
                                                this.$message({
                                                        message: `"${node.role_name}"角色，删除成功！ `,
                                                        type: "success",
                                                });
	                                })
					.catch(() => {});
                        },
			beginAdd(node){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.mode =true;
                                this.edit.model.role_id = -1;
				this.edit.model.role_name = "";
				this.edit.isEdit = true;
			},
		        async beginRoleFuncConfig(role_id) {
			        let roleFuncs = await this.$http({url: "/role_function/list/" + role_id})
			        console.log(roleFuncs);
				let roleFuncIds = roleFuncs.reduce((result, item) => {
			                result.push(item.func_id);
			                return result;
				},[]);
                                console.log(roleFuncIds);
			        this.updateTreeData(roleFuncIds);
			        this.editfr.model.role_func_ids = "";
                                this.editfr.model.role_id = role_id;
			        this.editfr.isEdit = true;
		        },
                        switchChangeHandler(node) {
	                        if(node.func_key === "") {
					node.children && node.children.forEach(item => item.open = node.open);
	                        }else{
					let parent = this.editfr.treeData.find(item => item.func_id === node.func_fid);
					parent.open = parent.children.some(item => item.open)
	                        }
                        },
		        async roleFuncConfig(){
			        //发ajax前统计树中选中的
			        let func_ids = [];
			        this.editfr.treeData.forEach(item => {
			                if(item.open) func_ids.push(item.func_id);
			                item.children && item.children.forEach(item2 => {
			                        if(item2.open) func_ids.push(item2.func_id)
			                })
			        });

			        this.editfr.model.role_func_ids =func_ids.join(",")
			        await this.$http({      //发ajax
				        method: "post",
				        url: "role_function/config",
				        data: this.editfr.model
			        });
			        this.editfr.isEdit = false;
			        this.$message({message: "角色功能分配成功！", type: "success"})
		        },
                        beginUndate(node){
                                this.$refs.form && this.$refs.form.resetFields();
			        this.edit.mode =false;
                                this.edit.model.role_id = node.role_id;
                                this.edit.model.role_name = node.role_name;
                                this.edit.isEdit = true;
                        },
		        save() {
                                this.$refs.form.validate(async valid => {
					if(!valid) return;
					if(this.edit.mode) {
						await this.addRole(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: "角色添加成功！",
                                                        type: "success",
                                                });
					}else{
					        await this.updateRole(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: "角色修改成功！ ",
                                                        type: "success",
                                                });
					};
					this.edit.isEdit = false;
                                })
		        },
                        handleClose(done) {
                                this.$confirm('确认关闭？')
                                        .then(_ => {
                                                done();
                                        })
                                        .catch(_ => {});
                        },
	        },
	        watch: {
		        listToTree() {
                                this.editfr.isEdit = false;
                                this.updateTreeData([]);
		        }
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-col
	margin-top: 25px
	.el-card
		position relative
		text-align: center
		padding: 10% 0
		color: #333
		background-color rgba(255, 250, 230, 0.65)
		cursor pointer
		.button-wrapper
			position absolute
			right 5px
			bottom 0
			.el-button
				font-size 18px
				margin-left 5px
.custom-tree
	width: 500px
	margin: 20px 0 50px 50px
	span.custom-tree-node
		flex: 1
		display: flex
		justify-content: space-between
		align-items: center
		&.parent
			padding-right: 50px
			color: #0094ff
.drawerFooter
	text-align: center
	display flex
	justify-content center

</style>