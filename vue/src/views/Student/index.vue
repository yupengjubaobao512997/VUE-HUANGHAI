<template>
	<div>
		<el-container>
			<el-header height="40px">
				<el-form inline label-position="left">
					<el-form-item label="学生姓名：">
						<el-input
							v-model="search.stu_name"
							placeholder="请输入姓名搜索"
							clearable
							@change="getData(true)"
							prefix-icon="el-icon-search"
						></el-input>
					</el-form-item>
					<el-form-item label="所在班级：">
						<el-select
							v-model="search.stu_cls_id"
							@change="getData(true)"
						>
							<el-option label="-全部-" :value="0"></el-option>
							<el-option label="-无班级-" :value="null"></el-option>
							<el-option
								v-for="item in classList"
								:key="item.cls_id"
								:label="item.cls_name"
								:value='item.cls_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="学生学历：">
						<el-select
							@change="getData(true)"
							v-model="search.stu_qualification">
							<el-option label="-全部-" :value="0"></el-option>
							<el-option
								v-for="item in $store.getters['dictionary/stfDtList']('qualification')"
								:key="item.dic_id"
								:label="item.dic_name"
								:value='item.dic_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-button
						size="mini"
						type="primary "
						@click="beginAdd"
					>
						<i class="el-icon-plus"></i>
						新增
					</el-button>
					<el-button
						size="mini"
						type="success "
						@click="beginDivideIntoClass()"
					>
						<i class="el-icon-share"></i>
						批量分班
					</el-button>
				</el-form>
			</el-header>
			<el-main>
				<el-table :data="studentList" :border="true" stripe fit
				          @selection-change="handleSelectionChange">
					<el-table-column label="#" type="index" width="50px"
					                 align="center" fixed></el-table-column>
					<el-table-column type="selection" width="55" fixed></el-table-column>
					<el-table-column label="学生姓名" prop="stu_name" width="100px" align="center"
					                 fixed></el-table-column>
					<el-table-column label="班级" width="100px">
						<template slot-scope="{row}" width="90px">
							<span v-if="row.stu_cls_id !== null && studentList.length > 0"
							      v-text="classList.find(item => item.cls_id === row.stu_cls_id).cls_name"></span>
							<span :class="row.stu_cls_id === null? 'no-class' : '' "
							      v-else-if="row.stu_cls_id === null && studentList.length > 0"
							      v-text="'无班级'"></span>
						</template>
					</el-table-column>
					<el-table-column label="存档照片" width="80px">
						<template slot-scope="{row}">
							<el-popover
								v-if="row.stu_avatar !== null"
								placement="right"
								width="100"
								:value="false">
								<p v-text="row.stu_name"></p>
								<el-image
									style="width: 150px; height: 140px"
									:src="row.stu_avatar"
									fit="fill"></el-image>
								<el-button slot="reference" type="text">预览</el-button>
							</el-popover>
							<span :class="row.stu_avatar === null? 'no-photo' : ''" v-else
							      v-text="'没有照片'"></span>
						</template>
					</el-table-column>
					<el-table-column label="性别" width="80px">
						<template slot-scope="{row}" width="90px">
							<span v-text="row.stu_sex === 1? '男' : '女'"></span>
						</template>
					</el-table-column>
					<el-table-column label="联系电话" width="150px" prop="stu_phone"></el-table-column>
					<el-table-column label="联系电话（备用）" width="150px"
					                 prop="stu_phone2"></el-table-column>
					<el-table-column label="出生日期" width="150px" prop="stu_born"></el-table-column>
					<el-table-column label="学历" width="130px" prop="stu_phone">
						<template slot-scope="{row}">
							<span v-text="$store.getters['dictionary/stfDtList']('qualification').find(item => item.dic_id == row.stu_qualification).dic_name"></span>
						</template>
					</el-table-column>
					<el-table-column label="毕业院校" width="150px" prop="stu_school"></el-table-column>
					<el-table-column label="院校专业" width="150px" prop="stu_major"></el-table-column>
					<el-table-column label="家庭住址" width="300px"
					                 prop="stu_address"></el-table-column>
					<el-table-column label="备注" width="200px" prop="stu_remark"
					                 show-overflow-tooltip>
						<template slot-scope="{row}">
							<span :class="row.stu_remark === ''? 'no-remark' : ''"
							      v-text="row.stu_remark === ''? '暂无相关备注...' : row.stu_remark "></span>
						</template>
					</el-table-column>
					<el-table-column
						label="操作" width="300px" fixed="right">
						<template slot-scope="{row}">
							<el-button
								size="mini"
								type="success "
								@click="beginDivideIntoClass(row)">
								分班
							</el-button>
							<el-button
								size="mini"
								type="danger "
								@click="beginUploadEdit(row)">
								照片存档
							</el-button>
							<el-button
								size="mini"
								type="primary"
								@click="beginUpdate(row)">
								编辑
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
				<h1 slot="title" v-text="edit.mode? '学生-新增': '学生-修改'"></h1>
				<el-form :model="edit.model" label-width="150px" ref="form" :rules="edit.rules">
					<el-form-item label="学生姓名：" prop="stu_name">
						<el-input v-model.trim="edit.model.stu_name"
						          placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item label="性别：">
						<template>
							<el-radio v-model="edit.model.stu_sex" :label="0">女</el-radio>
							<el-radio v-model="edit.model.stu_sex" :label="1">男</el-radio>
						</template>
					</el-form-item>
					<el-form-item label="联系电话：" prop="stu_phone">
						<el-input v-model.trim="edit.model.stu_phone" placeholder="请输入手机号"
						          maxlength="11" show-word-limit></el-input>
					</el-form-item>
					<el-form-item label="备用电话：" prop="stu_phone2">
						<el-input v-model.trim="edit.model.stu_phone2"
						          placeholder="请输入备用联系电话(手机号/座机号)">
							<template slot="append">例如：028-88888888</template>
						</el-input>
					</el-form-item>
					<el-form-item label="出生日期：" prop="stu_born">
						<template>
							<el-date-picker
								v-model="edit.model.stu_born"
								type="date"
								format="yyyy 年 MM 月 dd 日"
								value-format="yyyy-MM-dd"
								placeholder="选择日期">
							</el-date-picker>
						</template>
					</el-form-item>
					<el-form-item label="学历：" prop="stu_qualification">
						<el-select
							placeholder="-请选择"
							v-model="edit.model.stu_qualification">
							<el-option label="-请选择-" :value="0"></el-option>
							<el-option
								v-for="item in $store.getters['dictionary/stfDtList']('qualification')"
								:key="item.dic_id"
								:label="item.dic_name"
								:value='item.dic_id'
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="在读/毕业院校：">
						<el-input v-model.trim="edit.model.stu_school"
						          placeholder="请输入读/毕业院校（选填）"></el-input>
					</el-form-item>
					<el-form-item label="在校学习专业：">
						<el-input v-model.trim="edit.model.stu_major"
						          placeholder="请输入在校学习专业（选填）"></el-input>
					</el-form-item>
					<el-form-item label="家庭住址：" prop="stu_address">
						<el-input v-model.trim="edit.model.stu_address"
						          placeholder="请输入家庭住址"></el-input>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input type="textarea" v-model="edit.model.stu_remark"
						          placeholder="请输入备注"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="edit.isEdit =false">取  消</el-button>
					<el-button type="primary"
					           @click="save">确  认</el-button>
				</span>
			</el-dialog>
			<el-dialog :modal="false" :visible.sync="divideIntoClassesEdit.isEdit"
			           width="700px" :before-close="handleClose">
				<h1 slot="title" v-text="'分班'"></h1>
				<el-form :model="divideIntoClassesEdit.model" label-width="150px" ref="form"
				         :rules="divideIntoClassesEdit.rules">
					<el-form-item label="班级：" prop="stu_cls_id">
						<el-select
							v-model="divideIntoClassesEdit.model.stu_cls_id">
							<el-option label="-无班级-" :value="null"></el-option>
							<el-option
								v-for="item in classList"
								:key="item.cls_id"
								:label="item.cls_name"
								:value='item.cls_id'
								:disabled="item.cls_end !== null"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="divideIntoClassesEdit.isEdit =false">取  消</el-button>
					<el-button type="primary"
					           @click="divideIntoClassesSave">确  认</el-button>
				</span>
			</el-dialog>
			<el-dialog :modal="false" :visible.sync="uploads.isEdit"
			           width="700px" :before-close="handleClose">
				<h1 slot="title" v-text="'照片存档'"></h1>
				<el-image v-if="uploads.model.stu_avatar_old !== null"
				          style="width: 100px; height: 100px"
				          :src="uploads.model.stu_avatar_old"
				          fit="fill"></el-image>
				<el-upload ref="upload"
				           accept=".jpg,.png"
				           list-type="picture-card"
				           name="avatar"
				           :headers="uploads.uploadHeaders"
				           :before-upload="beforeAvatarUpload"
				           action="/student/avatarupload"
				           :on-success="avatarUploadSuccess"
				           :on-remove="avatarRemove"
				>
					<i class="el-icon-plus"></i>
					<p slot="tip">只能上传图片，并且最大不超过2M</p>
				</el-upload>
				<span slot="footer" class="dialog-footer">
					<el-button @click="uploads.isEdit =false">取  消</el-button>
					<el-button type="primary"
					           @click="avatarUpload" :disabled="uploads.model.stu_avatar_new ===''">确  认</el-button>
				</span>
			</el-dialog>
		</el-container>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: "Student",
                data(){
                        return {
                                studentList: [],
                                classList: [],
                                search: {
                                        stu_name: "",
                                        stu_cls_id: 0,
                                        stu_qualification: 0
                                },
                                pagination: {
                                        total: 0,
                                        pageSize: 5,
                                        currentPage: 1
                                },
                                edit: {
                                        isEdit: false,
                                        mode: true,
                                        model: {
                                                stu_id: 0,
                                                stu_name: "",
                                                stu_avatar: "",
                                                stu_cls_id: null,
                                                stu_sex: 0,
                                                stu_phone: "",
                                                stu_phone2: "",
                                                stu_born: "",
                                                stu_qualification: 0,
                                                stu_school: "",
                                                stu_major: "",
                                                stu_address: "",
                                                stu_remark: ""
                                        },
                                        rules: {
                                                stu_name: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value.length === 0)
                                                                        callback(new Error("*学生姓名必填"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                stu_phone: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value.length === 0)
                                                                        callback(new Error("*学生手机号码必填"))
                                                                else if(value.length < 11)
                                                                        callback(new Error("*无效手机号码"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                stu_phone2: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value.length === 0)
                                                                        callback(new Error("*联系方式必填"))
                                                                else if(value.length < 11)
                                                                        callback(new Error("*无效手机号码"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                stu_born: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value.length === 0)
                                                                        callback(new Error("*出生日期必填"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                stu_qualification: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value === 0)
                                                                        callback(new Error("*学历必填"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                                stu_address: [{
                                                        validator: (rule, value, callback) =>{
	                                                        if(value.length === 0)
                                                                        callback(new Error("*家庭住址必填"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                        }
                                },
                                uploads: {
                                        isEdit: false,
                                        uploadHeaders: {'Authorization': sessionStorage.getItem("token")},
                                        isUpload: false,
                                        model: {
                                                stu_id: null,
                                                stu_avatar_old: null,
                                                stu_avatar_new: ""
                                        }
                                },
                                divideIntoClassesEdit: {
                                        isEdit: false,
                                        model: {
                                                id: null,
                                                divideIntoClassIdList: [],
                                                stu_cls_id: null
                                        },
                                        rules: {
                                                stu_cls_id: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value === null)
                                                                        callback(new Error("*班级必选"))
                                                                else
                                                                        callback();
                                                        },
                                                        trigger: "blur",
                                                }],
                                        }

                                },
                        }
                },
                async created(){
//                        this.classList = await this.$http({url: "/class/all"});
//                        await this.getData();
                        Promise.all([
                                this.$http({url: "/class/all"}),
                                this.$http({
                                        url: "/student/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                "begin": this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                "pageSize": this.pagination.pageSize
                                        }
                                })
                        ])
                                .then(([classList, students]) =>{
                                        this.classList = classList
                                        this.studentList = students.list;
                                        this.pagination.total = students.total;
                                })
                                .catch(() =>{
                                })
                },
                methods: {
                        async getData(fromPage1 = true){
                                let {list, total} = await this.$http({
                                        url: "/student/list",
                                        method: "post",
                                        data: {
                                                ...this.search,
                                                "begin": this.pagination.pageSize * (this.pagination.currentPage - 1),
                                                "pageSize": this.pagination.pageSize
                                        }
                                });
                                this.studentList = list;
                                this.pagination.total = total;

                        },
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.stu_id = 0;
                                this.edit.model.stu_name = "";
                                this.edit.model.stu_avatar = "";
                                this.edit.model.stu_cls_id = null;
                                this.edit.model.stu_sex = 0;
                                this.edit.model.stu_phone = "";
                                this.edit.model.stu_phone2 = "";
                                this.edit.model.stu_born = "";
                                this.edit.model.stu_qualification = 0;
                                this.edit.model.stu_school = "";
                                this.edit.model.stu_major = "";
                                this.edit.model.stu_address = "";
                                this.edit.model.stu_remark = "";
                                this.edit.mode = true;
                                this.edit.isEdit = true;
                        },
                        beginUpdate(row){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.model.stu_id = row.stu_id;
                                this.edit.model.stu_name = row.stu_name;
                                this.edit.model.stu_avatar = row.stu_avatar;
                                this.edit.model.stu_cls_id = row.stu_cls_id;
                                this.edit.model.stu_sex = row.stu_sex;
                                this.edit.model.stu_phone = row.stu_phone;
                                this.edit.model.stu_phone2 = row.stu_phone2;
                                this.edit.model.stu_born = row.stu_born;
                                this.edit.model.stu_qualification = row.stu_qualification;
                                this.edit.model.stu_school = row.stu_school;
                                this.edit.model.stu_major = row.stu_major;
                                this.edit.model.stu_address = row.stu_address;
                                this.edit.model.stu_remark = row.stu_remark;
                                this.edit.mode = false;
                                this.edit.isEdit = true;
                        },
                        beginDivideIntoClass(row){
                                if(row !== undefined){
                                        this.divideIntoClassesEdit.model.id = row.stu_id;
                                        this.divideIntoClassesEdit.isEdit = true;
                                }else if(this.divideIntoClassesEdit.model.id === null && this.divideIntoClassesEdit.model.divideIntoClassIdList.length === 0){
                                        this.$alert('请选中学生之后再进行批量分班', '提示', {confirmButtonText: '确定'});
                                }else{
                                        this.divideIntoClassesEdit.isEdit = true;
                                }

                        },
                        beginUploadEdit(row){
                                console.log(row)
                                this.uploads.model.stu_id = row.stu_id;
                                this.uploads.model.stu_avatar_old = row.stu_avatar;
                                this.uploads.isEdit = true;
                        },
                        handleClose(done){
                                this.$confirm('确认关闭？')
                                        .then(_ =>{
                                                done();
                                        })
                                        .catch(_ =>{
                                        });
                        },
                        async save(){
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        if(this.edit.mode){
                                                let id = await this.$http({
                                                        url: "/student/add",
                                                        method: "post",
                                                        data: this.edit.model
                                                });
                                                this.edit.model.stu_id = id;
                                                this.studentList.push(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `"${this.edit.model.stu_name}"学生，添加成功！`,
                                                        type: "success",
                                                });
                                        }else{
                                                await this.$http({
                                                        url: "/student/update",
                                                        method: "post",
                                                        data: this.edit.model
                                                });
                                                let i = this.studentList.findIndex(item => item.stu_id === this.edit.model.stu_id);
                                                this.studentList.splice(i, 1, Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: `"${this.edit.model.stu_name}"学生，修改成功！"`,
                                                        type: "success",
                                                });
                                        }
                                        ;
                                        this.edit.isEdit = false;
                                });
                        },
                        async divideIntoClassesSave(){
                                this.$refs.form.validate(async valid =>{
                                        if(!valid) return;
                                        await this.$http({
                                                url: "/student/assignclass",
                                                method: "post",
                                                data: this.divideIntoClassesEdit.model
                                        });
                                        if(this.divideIntoClassesEdit.model.id !== null){
                                                this.studentList.find(item => item.stu_id === this.divideIntoClassesEdit.model.id).stu_cls_id = this.divideIntoClassesEdit.model.stu_cls_id;
                                        }else{
                                                this.divideIntoClassesEdit.model.divideIntoClassIdList.forEach(item =>{
                                                        this.studentList.find(item2 => item2.stu_id === item).stu_cls_id = this.divideIntoClassesEdit.model.stu_cls_id;
                                                })
                                        }
                                        this.$message({message: "班级分配成功", type: "success",});
                                        this.divideIntoClassesEdit.model.id = null;
                                        this.divideIntoClassesEdit.model.stu_cls_id = null;
                                        this.divideIntoClassesEdit.isEdit = false;
                                });
                        },
                        handleSelectionChange(selection){
                                this.divideIntoClassesEdit.model.divideIntoClassIdList = [];
                                selection.forEach(item =>{
                                        this.divideIntoClassesEdit.model.divideIntoClassIdList.push(item.stu_id)
                                });

                        },
                        beforeAvatarUpload(file){
                                const isJPG = file.type === 'image/jpeg';
                                const isPNG = file.type === 'image/png';
                                const isLt2M = file.size / 1024 / 1024 < 2;

                                if((!isJPG) && (!isPNG)){
                                        this.$message.error('上传头像图片只能是 JPG 格式!');
                                }
                                if(!isLt2M){
                                        this.$message.error('上传头像图片大小不能超过 2MB!');
                                }
                                return (isJPG || isPNG) && isLt2M;
                        },
                        avatarUploadSuccess({status, data, message}, file, fileList){
                                switch(status){
                                        case 200:
                                                this.uploads.model.stu_avatar_new = data;
                                                if(fileList.length > 1) fileList.shift();
                                                break;
                                        case 401:

                                        case 404:
                                        case 199:
                                        case 500:
                                                this.$message.error(message)
                                }
                        },
                        avatarRemove(file, fileList){
                                this.uploads.model.stu_avatar_new = "";
                        },
                        async avatarUpload(){
                                let data = await this.$http({
                                        method: "post",
                                        url: "/student/avatarupdate",
                                        data: this.uploads.model
                                });
                                this.studentList.find(item => item.stu_id === this.uploads.model.stu_id).stu_avatar = data;
                                this.$message.success("头像更新上传成功");
                                this.uploads.isEdit = false;
                                this.$refs.upload.clearFiles();
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
			.el-form
				min-width 1300px
		.el-main
			padding 10px 20px
			background-color azure
			border-top 1px solid #e0e0e0
			border-bottom 1px solid #e0e0e0
			.el-tabs__content
				min-width 1300px
				span.no-class, span.no-remark, span.no-photo
					color: #999

				h1
					background-color blue
					font-size 30px
					color #fff
		.el-footer
			display flex
			align-items center
			.el-pagination
				flex-grow 1


</style>