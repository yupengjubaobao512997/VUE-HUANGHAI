<template>
	<div>
		<el-container>
			<el-header height="30px">
				<div><span class="leave"></span><span>闲置</span></div>
				<div><span class="inUse"></span><span>使用中</span></div>
			</el-header>
			<el-main>
				<el-row :gutter="20">
					<el-col v-for="item in classrooms" :key="item.clsr_id" :span="6"  >
						<el-card shadow="hover" :class="item.clsr_occupy !== 1? 'leave': 'inUse'">
							<span v-text="item.clsr_name"></span>
							<div class="button-wrapper">
								<el-button type="text" @click="beginUndate(item)">
									<i class="el-icon-edit"></i>
								</el-button>
								<el-button type="text" @click="remove(item)" v-show="item.clsr_occupy !== 1">
									<i class="el-icon-delete"></i>
								</el-button>
							</div>
						</el-card>
					</el-col>
					<el-col :span="6">
						<el-card shadow="hover">
							<div class="add-btn" @click="beginAdd">
								<i class="el-icon-plus"></i>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-dialog :modal="false" :title="edit.mode? '教室维护功能-新增' : '教室维护功能-修改'"
				           :visible.sync="edit.isEdit" width="600px" :before-close="handleClose">
					<el-form :model="edit.model" label-width="120px" ref="form" :rules="edit.rules">
						<el-form-item label="教室名称：" prop="role_name">
							<el-input v-model.trim="edit.model.clsr_name"
							          placeholder="请输入教室名称"></el-input>
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="edit.isEdit =false">取 消</el-button>
						<el-button type="primary" @click="save">确 定</el-button>
					</span>
				</el-dialog>
			</el-main>
		</el-container>
	</div>
</template>

<script type="text/ecmascript-6">
        import {createNamespacedHelpers} from "vuex";
        let {mapState, mapActions} = createNamespacedHelpers("classroom");

        export default {
                name: "Classroom",
                data(){
                        return {
                                edit: {
                                        isEdit: false,
                                        mode: true,
                                        model: {clsr_id: -1, clsr_name: ""},
                                        rules: {
                                                clsr_name: [
                                                        {
                                                                validator: (rule, value, callback) =>{
                                                                        let {clsr_name, clsr_id} = this.edit.model;
                                                                        if(value.length === 0)
                                                                                callback(new Error("* 教室名不能为空"));
                                                                        else if(value.length < 2 || value.length > 50)
                                                                                callback(new Error("* 教室名长度2-20"));
                                                                        else if(this.classrooms.some(item => item.clsr_name === clsr_name && item.clsr_id !== clsr_id))
                                                                                callback(new Error("* 教室名已存在"));
                                                                        else
                                                                                callback();
                                                                },
                                                                trigger: "blur",
                                                        }
                                                ],
                                        }
                                }
                        }
                },
                computed: {
                        ...mapState(["classrooms"]),
                },
                async created(){
                        await this.init();
                        console.log(this.classrooms[1].clsr_occupy)
                },
                methods: {
                        ...mapActions(['init', "removeClassroom", "addClassroom", "updateClassroom"]),
                        remove(node) {
                                this.$confirm(`确定要删除"${node.clsr_name}"教室吗`,"警告", { type: "warning"})
                                        .then(async () =>{
                                                await this.removeClassroom( node.clsr_id);
                                                this.$message({
                                                        message: `"${node.clsr_name}"教室，删除成功！ `,
                                                        type: "success",
                                                });
                                        })
                                        .catch(() => {});
                        },
                        beginAdd(){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.mode =true;
                                this.edit.model.clsr_id = -1;
                                this.edit.model.clsr_name = "";
                                this.edit.isEdit = true;
                        },
                        beginUndate(node){
                                this.$refs.form && this.$refs.form.resetFields();
                                this.edit.mode =false;
                                this.edit.model.clsr_id = node.clsr_id;
                                this.edit.model.clsr_name = node.clsr_name;
                                this.edit.isEdit = true;
                        },
                        save() {
                                this.$refs.form.validate(async valid => {
                                        if(!valid) return;
                                        if(this.edit.mode) {
                                                await this.addClassroom(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: "教室添加成功！",
                                                        type: "success",
                                                });
                                        }else{
                                                await this.updateClassroom(Object.assign({}, this.edit.model));
                                                this.$message({
                                                        message: "教室修改成功！ ",
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
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-header
		display flex
		div
			display flex
			align-items center
			span
				display inline-block
				min-height 30px
				min-width 30px
				line-height 30px
				margin 0 5px 0 15px
			.leave
				background-color #67c23a
			.inUse
				background-color chocolate

	.el-col
		margin-top 25px
		.el-card
			position relative
			text-align: center
			padding: 10% 0
			color: #333
			font-size 20px
			background-color rgba(255, 250, 230, 0.65)
			cursor pointer
			.button-wrapper
				position absolute
				right 5px
				bottom 0
				.el-button
					font-size 18px
					margin-left 5px
					i
						color blanchedalmond
		.leave
			color #fff
			background-color #67c23a
		.inUse
			color #fff
			background-color #E6A23C

</style>