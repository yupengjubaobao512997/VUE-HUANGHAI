<template>
	<div>
		<el-container>
			<el-header>
				<el-form inline label-position="left">
					<el-form-item label="班级名称：">
						<el-input v-model="search.cls_name"
						          @change="getData(true)"
						          prefix-icon="el-icon-search" clearable></el-input>
					</el-form-item>
					<el-form-item label="班级专业：">
						<el-select placeholder="-请选择"
						           v-model="search.cls_dic_id_major"
						           @change="getData(true)">
							<el-option label="-所有专业-" :value="0"></el-option>
							<el-option
								v-for="item in $store.getters['dictionary/stfDtList']('class_major')"
								:key="item.dic_id"
								:label="item.dic_name"
								:value='item.dic_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="班级状态：">
						<el-select placeholder="-请选择" v-model="search.cls_status"
						           @change="getData(true)">
							<el-option label="-所有-" :value="0"></el-option>
							<el-option label="-结课-" :value="3" :key="3"></el-option>
							<el-option label="-开课中-" :value="1" :key="1"></el-option>
							<el-option label="-未开课-" :value="2" :key="2"></el-option>
						</el-select>
					</el-form-item>
					<el-button icon="el-icon-plus" type="success" @click="beginAdd">新增</el-button>
				</el-form>
			</el-header>
			<el-main>
				<el-table :data="classList" :border="true" stripe>
					<el-table-column label="#" type="index" width="50px"
					                 align="center"></el-table-column>
					<el-table-column label="班级名称" prop="cls_name" width="100px"
					                 align="center"></el-table-column>
					<el-table-column label="班级专业" width="90px">
						<template slot-scope="{row}" width="90px">
							<span v-text="$store.getters['dictionary/stfDtList']('class_major').find(item => item.dic_id === row.cls_dic_id_major).dic_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="教学老师" width="90px">
						<template slot-scope="{row}" width="90px">
							<span v-if="row.cls_stf_id_teacher !== null && teacherList.stfTeacher.length > 0"
							      v-text="teacherList.stfTeacher.find(item => item.stf_id === row.cls_stf_id_teacher).stf_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="导员" width="90px">
						<template slot-scope="{row}" width="90px">
							<span v-if="row.cls_stf_id_admin !== null && teacherList.stfAdmin.length > 0"
							      v-text="teacherList.stfAdmin.find(item => item.stf_id === row.cls_stf_id_admin).stf_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="就业老师" prop="" width="90px">
						<template slot-scope="{row}" width="90px">
							<span v-if="row.cls_stf_id_job !== null && teacherList.stfJob.length > 0"
							      v-text="teacherList.stfJob.find(item => item.stf_id === row.cls_stf_id_job).stf_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="教室" width="90px">
						<template slot-scope="{row}" width="90px">
							<span v-if="row.cls_clsr_id !== null && classrooms.length > 0"
							      v-text="classrooms.find(item => item.clsr_id === row.cls_clsr_id).clsr_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="开课时间" prop="cls_begin" width="140px"></el-table-column>
					<el-table-column label="节课时间" prop="cls_end" width="140px"></el-table-column>
					<el-table-column label="班级状态" prop="" width="90px">
						<template slot-scope="{row}" width="90px">
							<span v-if="row.cls_begin === null">未开课</span>
							<span v-else-if="row.cls_begin !== null && row.cls_end === null">开课中</span>
							<span v-else>结课</span>
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="" width="200px" show-overflow-tooltip>
						<template slot-scope="{row}">
							<span class="no-role"
							      v-if="row.cls_remark ==='' && classList.length > 0">暂无相关备注..</span>
							<span class="remark" v-else
							      v-text="classList.find(item => item.cls_id === row.cls_id ).cls_remark"></span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200px" fixed="right">
						<template slot-scope="{row}">
							<el-button
								size="mini"
								type="primary "
								@click="beginUpdate(row)">修改
							</el-button>
							<el-button v-if="row.cls_begin !== null && row.cls_end === null"
							           size="mini"
							           type="danger "
							           @click="schoolEnd(row)">
								结课
							</el-button>
							<el-button
								v-else-if="row.cls_begin === null && row.cls_end === null"
								size="mini"
								type="success "
								@click="beginEditClass(row)">
								开课
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
			<el-dialog :modal="false" :visible.sync="edit.isEdit"
			           width="700px" :before-close="handleClose">
				<h1 slot="title" v-text="edit.mode? '班级-新增': '班级-修改'"></h1>
				<el-form :model="edit.model" label-width="100px" ref="form"
				         :rules="edit.rules" @validate="formValidateHandler">
					<el-form-item label="班级名称：" prop="cls_name">
						<el-input v-model.trim="edit.model.cls_name" placeholder="请输入班级名称"></el-input>
					</el-form-item>
					<el-form-item label="班级专业：" prop="cls_dic_id_major">
						<el-select
							placeholder="-请选择"
							v-model="edit.model.cls_dic_id_major">
							<el-option label="-请选择-" :value="0"></el-option>
							<el-option
								v-for="item in $store.getters['dictionary/stfDtList']('class_major')"
								:key="item.dic_id"
								:label="item.dic_name"
								:value='item.dic_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="教学老师：" prop="cls_stf_id_teacher">
						<el-select
							placeholder="-请选择"
							v-model="edit.model.cls_stf_id_teacher">
							<el-option label="-请选择-" :value="0"></el-option>
							<el-option v-for="item in teacherList.stfTeacher"
							           :key="item.stf_id"
							           :label="item.stf_name"
							           :value='item.stf_id'
                         :disabled="item.stf_invalid === 0"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="导员：" prop="cls_stf_id_admin">
						<el-select
							placeholder="-请选择"
							v-model="edit.model.cls_stf_id_admin">
							<el-option label="-请选择-" :value="0"></el-option>
							<el-option v-for="item in teacherList.stfAdmin"
							           :key="item.stf_id"
							           :label="item.stf_name"
							           :value='item.stf_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="就业老师：" prop="cls_stf_id_job">
						<el-select
							placeholder="-请选择"
							v-model="edit.model.cls_stf_id_job">
							<el-option label="-请选择-" :value="0"></el-option>
							<el-option v-for="item in teacherList.stfJob"
							           :key="item.stf_id"
							           :label="item.stf_name"
							           :value='item.stf_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input type="textarea" v-model="edit.model.cls_remark"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="edit.isEdit =false">取  消</el-button>
					<el-button type="primary" @edit="
						edit.isEdit =false"
					           @click="save">确  认</el-button>
				</span>
			</el-dialog>
			<el-dialog :modal="false" :visible.sync="edit.isBeginSchool" width="500px"
			           :before-close="handleClose">
				<h1 slot="title">开班</h1>
				<el-form :model="edit.model">
					<el-form-item label="班级教室：">
						<el-select
							placeholder="-请选择"
							v-model="edit.model.cls_clsr_id">
							<el-option label="-请选择-" :value="0"></el-option>
							<el-option
								v-for="item in classrooms"
								:key="item.clsr_id"
								:label="item.clsr_name"
								:value='item.clsr_id'
								:disabled="item.clsr_occupy === 1"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="edit.isBeginSchool =false">取  消</el-button>
					<el-button type="primary"
					           @click="schoolBegins">确  认</el-button>
				</span>
			</el-dialog>
		</el-container>
	</div>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from "vuex";

        let {mapState: clsrMapState, mapActions: clsrMapActions} = createNamespacedHelpers("classroom");
        export default {
                name: "Class",
                data(){
                        return {
                                EnumStaffCategory: {
                                        teacher: 4,
                                        admin: 5,
                                        job: 6
                                },
                                teacherList: {
                                        stfTeacher: [],
                                        stfAdmin: [],
                                        stfJob: []
                                },
                                classList: [],
                                search: {cls_name: "", cls_dic_id_major: 0, cls_status: 0},
                                pagination: {
                                        total: 0,
                                        pageSize: 5,
                                        currentPage: 1
                                },
                                edit: {
                                        isBeginSchool: false,
                                        isEdit: false,
                                        mode: true,
                                        model: {
                                                cls_id: -1,
                                                cls_clsr_id: null,
                                                cls_name: "",
                                                cls_dic_id_major: 0,
                                                cls_stf_id_teacher: 0,
                                                cls_stf_id_admin: 0,
                                                cls_stf_id_job: 0,
                                                cls_remark: "",
                                                cls_begin: null,
                                                cls_end: null
                                        },
                                        rules: {
                                                cls_name: [{
                                                        validator: async(rule, value, callback) =>{
                                                                let {cls_name} = this.edit.model;
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(value.length < 2 || value.length > 20)
                                                                        callback(new Error("* 班级名长度2-20"));
                                                                else if(await this.$http({
                                                                                url: "/class/valid_name",
                                                                                method: "post",
                                                                                data: {cls_name: value}
                                                                        }))
                                                                        callback(new Error("*班级名已存在"));
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                cls_dic_id_major: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(value === 0)
                                                                        callback(new Error("*班级专业必选"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                cls_stf_id_teacher: [{
                                                        validator: (rule, value, callback) =>{
                                                                let {cls_stf_id_teacher} = this.edit.model;
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(value === 0)
                                                                        callback(new Error("*教学老师必选"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                cls_stf_id_admin: [{
                                                        validator: (rule, value, callback) =>{
                                                                let {cls_stf_id_admin} = this.edit.model;
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(value === 0)
                                                                        callback(new Error("*导员必选"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                cls_stf_id_job: [{
                                                        validator: (rule, value, callback) =>{
                                                                let {cls_stf_id_job} = this.edit.model;
                                                                if(!this.edit.mode)
                                                                        callback();
                                                                else if(value === 0)
                                                                        callback(new Error("*就业老师必选"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }]
                                        }
                                }
                        }
                },
                computed: {
                        ...clsrMapState(["classrooms"]),
                },
                created(){
//                        .then(list => this.teacherList.stfTeacher = list);
//                        .then(list => this.teacherList.stfAdmin = list);
//                        .then(list => this.teacherList.stfJob = list);
                        Promise.all([
                                this.$http({url: "/staff/listbycategory/" + this.EnumStaffCategory.teacher}),
                                this.$http({url: "/staff/listbycategory/" + this.EnumStaffCategory.admin}),
                                this.$http({url: "/staff/listbycategory/" + this.EnumStaffCategory.job}),
                                this.$http({
                                        url: "/class/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                "begin": this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                "pageSize": this.pagination.pageSize
                                        }
                                }),
                                this.clsrInit()

                        ])
	                        .then(([stfTeacher,stfAdmin,stfJob,classes]) => {
                                        this.teacherList.stfTeacher = stfTeacher;
                                        this.teacherList.stfAdmin = stfAdmin;
                                        this.teacherList.stfJob = stfJob;
                                        this.classList = classes.list;
                                        this.pagination.total = classes.total;
	                        })
	                        .catch(() => {})

                },
                methods: {
                        ...clsrMapActions({clsrInit: "init"}),
                        handleClose(done){
                                this.$confirm('确认关闭？')
                                        .then(_ =>{
                                                done();
                                        })
                                        .catch(_ =>{
                                        });
                        },
                        async getData(fromPage1 = true){
                                if(fromPage1) this.pagination.currentPage = 1;
                                let {list, total} = await this.$http({
                                                url: "/class/list",
                                                method: "post",
                                                data: {
                                                        ...this.search,
                                                        "begin": this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                        "pageSize": this.pagination.pageSize
                                                }
                                        });
                                this.classList = list;
                                this.pagination.total = total;
                        },
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.cls_id = -1;
                                this.edit.model.cls_name = "";
                                this.edit.model.cls_clsr_id = null;
                                this.edit.model.cls_dic_id_major = 0;
                                this.edit.model.cls_stf_id_teacher = 0;
                                this.edit.model.cls_stf_id_admin = 0;
                                this.edit.model.cls_stf_id_job = 0;
                                this.edit.model.cls_status = 1;
                                this.edit.model.cls_remark = "";
                                this.edit.mode = true;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(row){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.cls_id = row.cls_id;
                                this.edit.model.cls_clsr_id = row.cls_clsr_id;
                                this.edit.model.cls_name = row.cls_name;
                                this.edit.model.cls_dic_id_major = row.cls_dic_id_major;
                                this.edit.model.cls_stf_id_teacher = row.cls_stf_id_teacher;
                                this.edit.model.cls_stf_id_admin = row.cls_stf_id_admin;
                                this.edit.model.cls_stf_id_job = row.cls_stf_id_job;
                                this.edit.model.cls_begin = row.cls_begin;
                                this.edit.model.cls_end = row.cls_end;
                                this.edit.model.cls_remark = row.cls_remark;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        beginEditClass(row){
                                this.edit.model.cls_clsr_id = row.cls_clsr_id;
                                this.edit.model.cls_id = row.cls_id;
                                this.edit.model.cls_name = row.cls_name;
                                this.edit.isBeginSchool = true;
                        },
                        formValidateHandler(prop, valid, message){
                                if(prop === "cls_name") this.classNameValidateResult = valid;
                        },
                        async save(){
                                if(this.edit.mode){
                                        if(this.classNameValidateResult === false) return;
                                        if(typeof this.classNameValidateResult === "undefined"){
                                                await new Promise(resolve => this.$refs.form.validateField("cls_name", message =>{
                                                        if(message === "") resolve();
                                                }));
                                        }
                                }
                                await new Promise(resolve => this.$refs.form.validateField("cls_dic_id_major", message =>{
                                        if(message === "") resolve();
                                }));
                                await new Promise(resolve => this.$refs.form.validateField("cls_stf_id_teacher", message =>{
                                        if(message === "") resolve();
                                }));
                                await new Promise(resolve => this.$refs.form.validateField("cls_stf_id_admin", message =>{
                                        if(message === "") resolve();
                                }));
                                await new Promise(resolve => this.$refs.form.validateField("cls_stf_id_job", message =>{
                                        if(message === "") resolve();
                                }));
                                //代码执行到这里说明用户已经通过了验证，可以执行后续真正的新增与修改操作

                                if(this.edit.mode){
                                        let data = await this.$http({url: "/class/add", method: "post", data: this.edit.model});
                                        this.edit.model.cls_id = data;
                                        this.classList.push(Object.assign({}, this.edit.model));
                                        this.$message({message: "班级，添加成功！", type: "success",});
                                }else{
                                        await this.$http({url: "/class/update", method: "post", data: this.edit.model});
                                        let i = this.classList.findIndex(item => item.cls_id === this.edit.model.cls_id);
                                        this.classList.splice(i, 1, Object.assign({}, this.edit.model));
                                        this.$message({message: "班级，修改成功！", type: "success",});
                                };
                                this.edit.isEdit = false;

                        },
                        async schoolBegins(){
                                this.$confirm(`确定要对"${this.edit.model.cls_name}"班级进行开班吗`, "提示", {type: "warning"})
                                        .then(async() =>{
                                                let cls_begin = await this.$http({
                                                        url: "/class/begin",
                                                        method: "post",
                                                        data: {
                                                                cls_id: this.edit.model.cls_id,
                                                                cls_clsr_id: this.edit.model.cls_clsr_id
                                                        }
                                                });
                                                this.classList.find(item => item.cls_id === this.edit.model.cls_id).cls_clsr_id = this.edit.model.cls_clsr_id;
                                                this.classList.find(item => item.cls_id === this.edit.model.cls_id).cls_begin = cls_begin;
                                                this.$message({
                                                        message: `"${this.edit.model.cls_name}"班级，开班成功！`,
                                                        type: "success",
                                                });
                                        })
                                        .catch(() =>{
                                        });
                                this.edit.isBeginSchool = false;
                        },
                        async schoolEnd({cls_id, cls_name}){
                                this.$confirm(`确定要对"${cls_name}"班级进行结课吗`, "提示", {type: "warning"})
                                        .then(async() =>{
                                                let cls_end = await this.$http({
                                                        url: "/class/end",
                                                        method: "post",
                                                        data: {cls_id,}
                                                });
                                                this.classList.find(item => item.cls_id === cls_id).cls_end = cls_end;
                                                this.$message({
                                                        message: `"${cls_name}"班级，结课成功！`,
                                                        type: "success",
                                                });
                                        })
                                        .catch(() =>{
                                        })

                        }
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
			.el-table
				width 1376px
		.el-footer
			display flex
			align-items center
			.el-pagination
				flex-grow 1

	span.no-role
		color: #999
</style>