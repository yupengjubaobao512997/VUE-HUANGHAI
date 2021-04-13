<template>
	<div class="user">
		<el-container>
			<el-header height="40px" >
				<el-form :inline="true" label-position="left">
					<el-form-item label="姓名：" >
						<el-input v-model="search.user_name"
						          placeholder="请输入用户名搜索"
						          clearable
						          prefix-icon="el-icon-search"
							@change="getUser(true)"></el-input>
					</el-form-item>
					<el-form-item label="角色：">
						<el-select
							placeholder="-请选择"
							v-model="search.role_id"
							@change="getUser(true)">
							<el-option label="-全部-" :value="-1"></el-option>
							<el-option label="-无角色-" :value="0"></el-option>
							<el-option v-for="role in roles"
							           :key="role.role_id"
							           :label="role.role_name"
							           :value=role.role_id
							></el-option>
						</el-select>
					</el-form-item>
					<el-button
						size="mini"
						type="primary "
						@click="beginAdd">
						<i class="el-icon-plus"></i>
						新增
					</el-button>
				</el-form>
			</el-header>
			<el-main>
				<el-table :data="userList" :border="true" stripe fit >
					<el-table-column
						label="#"
						type="index"
						width="50px"
						align="center"
					></el-table-column>
					<el-table-column
						label="姓名"
						prop="user_name"
						width="100px"
						align="center"
					>
					</el-table-column>
					<el-table-column
						label="角色"
						width="100px">
						<template slot-scope="{row}">
							<span v-if="row.role_id !== null && roles.length > 0" v-text="roles.find(item => item.role_id ===row.role_id).role_name"></span>
							<span class="no-role" v-else>暂无角色</span>
						</template>
					</el-table-column>
					<el-table-column
						label="操作">
						<template slot-scope="{row}">
							<el-button
								size="mini"
								type="primary "
								@click="beginUpdate(row)">编辑</el-button>
							<el-button
								size="mini"
								type="danger"
								@click="remove(row.user_name)">删除</el-button>
							<el-popover placement="right" :value="isShow">
								<el-form  :inline="true">
									<el-form-item label="角色">
										<el-select placeholder="-请选择" v-model="edit.model.role_id">
											<el-option label="-无角色-" :value="0"></el-option>
											<el-option v-for="role in roles"
											           :key="role.role_id"
											           :label="role.role_name"
											           :value=role.role_id
											></el-option>
										</el-select>
										<el-button size="mini" type="primary" @click="roleFuncConfig" >分配</el-button>
									</el-form-item>
								</el-form>
								<el-button size="mini" type="success " @click.sync="beginRoleFuncConfig(row)" slot="reference">角色分配</el-button>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
			<el-footer>
				<el-pagination
					background
					:total="pagination.total"
					layout=" prev, pager, next, jumper,->,sizes,total"
					:page-sizes="[6,8,10,12,15]"
					:page-size.sync="pagination.pageSize"
					:current-page.sync="pagination.currentPage"
					@size-change="getUser()"
					@current-change="getUser(false)">
					</el-pagination>
			</el-footer>
			<el-dialog :modal="false" :title="edit.mode? '用户-新增' : '用户-修改'" :visible.sync="edit.isEdit" width="500px"  :before-close="handleClose">
				<el-form :model="edit.model" label-width="100px" :rules="edit.rules" ref="form" @validate="formValidateHandler">
					<el-form-item label="*用户名称：" prop="user_name">
						<el-input v-model.trim="edit.model.user_name" placeholder="用户名称" :disabled="!edit.mode"></el-input>
					</el-form-item>
					<el-form-item label="用户密码：" prop="user_pwd" >
						<el-input  v-model="edit.model.user_pwd" placeholder="密码" ></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="edit.isEdit =false">取  消</el-button>
					<el-button type="primary" @edit="
						edit.isEdit =false"
					        @click="save">确  认</el-button>
				</span>
			</el-dialog>
		</el-container>

	</div>
</template>

<script type="text/ecmascript-6">
	import {createNamespacedHelpers }from "vuex";
        import ElCol from "element-ui/packages/col/src/col";
        let {mapState, mapActions} = createNamespacedHelpers("role");
        export default {
                components: {ElCol},
                name: "User",
                data(){
                        return {
                                isShow: false,
                                userList: [],
	                        search:{
                                        user_name: "",
		                        role_id: -1,
	                        },
                                pagination: {
                                        total: 0,
	                                pageSize: 6,
	                                currentPage: 1
                                },
	                        edit: {
                                        mode: true,
		                        isEdit: false,
                                        model:{user_name: "", user_pwd: "", role_id: null},
		                        rules: {
                                                user_name:[{
                                                        validator: async(rule, value, callback) =>{
                                                                let {user_name} = this.edit.model;
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(!/[a-zA-Z][a-zA-Z0-9]{2,19}$/.test(value))
                                                                        callback(new Error("* 用户名长度3-20,且只能以字母开头，只能为字母数字"));
                                                                else if(await this.$http({url: "/user/valid_name", method: "post" ,data: {user_name:value}}))
                                                                        callback(new Error("*用户名已经存在"));
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
						user_pwd:[
							{required: true, message:"* 密码不能为空",trigger: "blur"},
						        {
                                                                min:3 ,max: 20,message: "*密码长度3-20", trigger: "blur",
						}]
                                        }
	                        }
                        }
                },
	        computed: {
		        ...mapState(["roles"]),
	        },
                created() {
                        this.roleInit();
                        this.getUser();
	        },
	        methods: {
                        ...mapActions({'roleInit': "init"}),
			async getUser(fromPage1 = true) {
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
	                                url: "/user/list" ,
	                                method: "post",
	                                data:{
		                                ...this.search,
		                                "begin": this.pagination.pageSize * (this.pagination.currentPage - 1),
		                                "pageSize": this.pagination.pageSize
	                                }
                                });
                                this.userList = list;
				this.pagination.total = total;
			},
                        remove(user_name){
                                this.$confirm(`确定要删除"${user_name}"用户吗`, "提示", {type: "warning"})
                                        .then(async() =>{
                                                await this.$http({url:"/user/remove/" + user_name, method: "post"});
                                                let i = this.userList.findIndex(item => item.user_name === user_name);
                                                this.userList.splice(i, 1);
                                                this.$message({
                                                        message: `"${user_name}"用户，删除成功！`,
                                                        type: "success",
                                                });
                                        })
                                        .catch(() =>{
                                        })
                        },
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();               //重置表单
                                //打开对话框前的准备工作
                                this.edit.model.user_name = "";
                                this.edit.model.user_pwd = "";
                                this.edit.model.role_id = null;
                                this.edit.mode = true;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(row){
                                this.$refs.form && this.$refs.form.resetFields();                //重置表单
                                this.edit.model.user_name = row.user_name;
                                this.edit.model.user_pwd = row.user_pwd;
                                this.edit.model.role_id = row.role_id;
                                this.edit.mode = false;
                                this.edit.isEdit = true;

                        },
                        formValidateHandler(prop, valid, message) {
                                if(prop === "user_name") this.userNameValidateResult = valid;
                        },
                        async save() {
                                if(this.edit.mode){
                                        if(this.userNameValidateResult === false) return;
					if(typeof this.userNameValidateResult === "undefined"){
					        await new Promise(resolve => this.$refs.form.validateField("user_name", message => {
					                if(message === "") resolve();
					        }));
					}
                                }
                                await new Promise(resolve => this.$refs.form.validateField("user_pwd", message => {
                                        if(message === "") resolve();
                                }))
				//代码执行到这里说明用户已经通过了验证，可以执行后续真正的新增与修改操作

                                        if(this.edit.mode){
                                                await this.$http({url:"/user/add" , method: "post" , data:this.edit.model});
                                                this.userList.push(Object.assign({},this.edit.model))
                                                this.$message({message: "用户，添加成功！", type: "success",});
                                        }else{
                                                await this.$http({url:"/user/change_pwd" , method: "post" , data:this.edit.model});
                                                let i = this.userList.findIndex(item => item.user_name === this.edit.model.user_name);
                                                this.userList.splice(i,1,Object.assign({},this.edit.model));
                                                this.$message({message: "用户，修改成功！", type: "success",});
                                        };
                                        this.edit.isEdit = false;

			},
                        handleClose(done){
                                this.$confirm('确认关闭？')
                                        .then(_ =>{
                                                done();
                                        })
                                        .catch(_ =>{
                                        });
                        },
			beginRoleFuncConfig(user) {
                                this.edit.model.user_name = user.user_name;
                                this.edit.model.role_id = user.role_id || 0;
                                this.isShow = true;
			},
                        async roleFuncConfig() {
                                await this.$http({method: "post", url: "/user/config_role", data: this.edit.model});
                                if(this.search.role_id === -1){
					let target = this.userList.find(item => item.user_name === this.edit.model.user_name);
					target.role_id = this.edit.model.role_id || null;
                                }else{
                                        let i = this.userList.find(item => item.user_name === this.edit.model.user_name);
                                        this.userList.splice(i, 1);
                                }
                                this.$message({
                                        message: `用户：${this.edit.model.user_name}, 角色分配成功！`,
	                                type: "success"
                                });
                                this.isShow = false;
                        }
	        },
	        watch:{
                        "edit.isEdit"(newValue) {
                                if(!newValue) delete this.userNameValidateResult;
                        }
	        }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>
	.el-container
		position absolute
		left 0
		top 0
		width: 100%
		height 100%;
		.el-header
			line-height 40px
		.el-main
			padding 10px 20px
			background-color azure
			border-top 1px solid #e0e0e0
			border-bottom 1px solid #e0e0e0
		.el-footer
			display flex
			align-items center
			.el-pagination
				flex-grow 1

	span.no-role
		color: #999

</style>