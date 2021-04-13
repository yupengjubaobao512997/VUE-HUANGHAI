<template>
	<div class="user">
		<el-container>
			<el-header height="40px">
				<el-form inline label-position="left">
					<el-form-item label="员工姓名：">
						<el-input v-model="search.stf_name"
						          placeholder="请输入姓名搜索"
						          clearable
						          prefix-icon="el-icon-search"
						          @change="getData(true)"></el-input>
					</el-form-item>
					<el-form-item label="职务：">
						<el-select
							placeholder="-请选择"
							v-model="search.stf_category"
							@change="getData(true)">
							<el-option label="-全部-" :value="0"></el-option>
							<el-option v-for="item in $store.getters['dictionary/stfDtList']('staff_category')"
							           :key="item.dic_id"
							           :label="item.dic_name"
							           :value='item.dic_id'
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
				<el-table :data="staffList" :border="true" stripe fit>
					<el-table-column label="#" type="index" width="50px" align="center"></el-table-column>
					<el-table-column label="姓名" prop="stf_name" width="100px" align="center"></el-table-column>
					<el-table-column label="职务类型" width="100px">
						<template slot-scope="{row}">
							<span v-text="dtList.find(item => item.dic_id === row.stf_category).dic_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="备注" width="300px">
						<template slot-scope="{row}">
							<span class="no-role" v-if="row.stf_remark ==='' && staffList.length > 0">暂无相关备注..</span>
							<span class="remark"  v-else  v-text="staffList.find(item => item.stf_id === row.stf_id ).stf_remark"></span>
						</template>
					</el-table-column>
					<el-table-column label="员工状态" width="80px">
						<template slot-scope="{row}">
							<span   v-show="row.stf_invalid">在职</span>
							<span   v-show="!row.stf_invalid">离职</span>
						</template>
					</el-table-column>
					<el-table-column
						label="操作">
						<template slot-scope="{row}">
							<el-button
								size="mini"
								type="primary "
								@click="beginUpdate(row)">编辑
							</el-button>
							<el-button
								size="mini"
								type="danger "
								@click="dimissions(row)" v-if="row.stf_invalid">
								离职
							</el-button>
							<el-button
								size="mini"
								type="warning "
								@click="reinstate(row)" v-else>
								入职
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
			<el-footer>
				<el-pagination
					background
					:total="pagination.total"
					layout=" prev, pager, next, jumper,->,sizes,total"
					:page-sizes="[5,8,10,12,15]"
					:page-size.sync="pagination.pageSize"
					:current-page.sync="pagination.currentPage"
					@size-change="getData()"
					@current-change="getData(false)">

				</el-pagination>
			</el-footer>
			<el-dialog :modal="false"  :visible.sync="edit.isEdit"
			           width="500px" :before-close="handleClose">
				<h1 slot="title" v-text="edit.mode? '员工维护-新增': '员工维护-修改'"></h1>
				<el-form :model="edit.model" label-width="100px"  ref="form" :rules="edit.rules"
				         >
					<el-form-item label="员工姓名：" prop="stf_name">
						<el-input v-model.trim="edit.model.stf_name" placeholder="请输入员工姓名"
						          ></el-input>
					</el-form-item>
					<el-form-item label="员工类型：" prop="stf_category">
						<el-select
							placeholder="-请选择"
							v-model="edit.model.stf_category">
							<el-option v-for="item in $store.getters['dictionary/stfDtList']('staff_category')"
							           :key="item.dic_id"
							           :label="item.dic_name"
							           :value='item.dic_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="员工备注：">
						<el-input type="textarea" v-model="edit.model.stf_remark"></el-input>
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
	import {createNamespacedHelpers}from "vuex";
	let{mapState, mapActions, mapGetters} = createNamespacedHelpers("dictionary")
        export default {
                name: "Staff",
                data(){
                        return {
                                staffList: [],
                                search: {
                                        stf_name: "",
                                        stf_category: null,

                                },
                                pagination: {
                                        total: 0,
                                        pageSize: 5,
                                        currentPage: 1
                                },
                                edit: {
                                        mode: true,
                                        isEdit: false,
                                        model: {stf_id: -1, stf_name: "", stf_category: null, stf_invalid: 0,stf_remark: ""},
	                                rules: {
                                                stf_name: [{
                                                        validator: async(rule, value, callback) =>{
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(value.length === 0)
                                                                        callback(new Error("* 请输入员工姓名"));
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                stf_category: [{
                                                        validator: async(rule, value, callback) =>{
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(value === null)
                                                                        callback(new Error("* 请选择员工类型"));
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
	                                }
                                }
                        }
                },
	        computed: {
		        ...mapState(['dtList']),
	        },
                created(){
                        this.init();
                        this.getData();
                },
                methods: {
	                ...mapActions(['init']),
                        async getData(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                        url: "/staff/list", method: "post", data: {
                                                ...this.search,
                                                'begin': this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                "pageSize": this.pagination.pageSize
//                                                'begin': 0,
//                                                "pageSize": 6
                                        }
                                })
                                this.staffList = list;
                                this.pagination.total = total;
                        },
//                        formValidateHandler(prop, valid, message) {
//                                if(prop === "stf_name") this.staffNameValidateResult = valid;
//                        },
	                beginAdd() {
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.stf_name = "";
                                this.edit.model.stf_category = null;
                                this.edit.model.stf_remark = "";
                                this.edit.mode = true;
                                this.edit.isEdit = true;

	                },
                        beginUpdate(row){
                                this.$refs.form && this.$refs.form.resetFields();                //重置表单
                                this.edit.model.stf_id = row.stf_id;
                                this.edit.model.stf_name = row.stf_name;
                                this.edit.model.stf_category = row.stf_category;
                                this.edit.model.stf_invalid = row.stf_invalid
                                this.edit.model.stf_remark = row.stf_remark;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        async save() {
//                                if(this.edit.mode){
//                                        if(this.staffNameValidateResult === false) return;
//                                        if(typeof this.staffNameValidateResult === "undefined"){
//                                                await new Promise(resolve => this.$refs.form.validateField("stf_name", message => {
//                                                        if(message === "") resolve();
//                                                }));
//                                        }
//                                }
//                                await new Promise(resolve => this.$refs.form.validateField("stf_category", message => {
//                                        if(message === "") resolve();
//                                }))
                                //代码执行到这里说明用户已经通过了验证，可以执行后续真正的新增与修改操作
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        if(this.edit.mode){
                                                await this.$http({url:"/staff/add" , method: "post" , data:this.edit.model});
                                                this.staffList.push(Object.assign({},this.edit.model))
                                                this.$message({message: `"${this.edit.model.stf_name}，添加成功！"`, type: "success",});
                                        }else{
                                                await this.$http({url:"/staff/update" , method: "post" , data:this.edit.model});
                                                let i = this.staffList.findIndex(item => item.stf_name === this.edit.model.stf_name);
                                                this.staffList.splice(i,1,Object.assign({},this.edit.model));
                                                this.$message({message: `"${this.edit.model.stf_name}，修改成功！"`, type: "success",});
                                        };
                                        this.edit.isEdit = false;
                                })

                        },
	                dimissions(row) {
                                this.$confirm(`确定要让"${row.stf_name}"老师离职吗`, "提示", {type: "warning"})
                                        .then(async() =>{
                                                await this.$http({ url: "/staff/dimission/" + row.stf_id});
                                                let i = this.staffList.findIndex(item => item.stf_id === row.stf_id);
                                                this.staffList[i].stf_invalid = 0
                                                this.$message({
                                                        message: `"${row.stf_name}"离职成功！`,
                                                        type: "success",
                                                });
                                        })
                                        .catch(() =>{
                                        })

                        },
	                reinstate(row) {
                               this.$confirm(`确定要让"${row.stf_name}"老师复职吗`, "提示", {type: "warning"})
                                       .then(async() =>{
                                               await this.$http({ url: "/staff/reinstate/" + row.stf_id});
                                               let i = this.staffList.findIndex(item => item.stf_id === row.stf_id);
                                               this.staffList[i].stf_invalid = 1
                                               this.$message({
                                                       message: `"${row.stf_name}"老师复职成功！`,
                                                       type: "success",
                                               });
                                       })
                                       .catch(() =>{
                                       })

                       },
                        handleClose(done){
                                this.$confirm('确认关闭？')
                                        .then(_ =>{
                                                done();
                                        })
                                        .catch(_ =>{
                                        });
                        },
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
		.el-dialog
			h1
				font-size 28px
				color #fff
				background-color blueviolet
			.el-textarea__inner
				height:80px;
	span.no-role
		color: #999
	span.remark
		white-space:nowrap
		overflow hidden
		text-overflow: ellipsis


</style>