<template>
	<div>
		<el-form :model="edit.model" inline label-position="left" label-width="100px" :rules="edit.rules"
		         ref="ruleForm">
			<el-form-item label="原始密码：" prop="oldPwd">
				<el-input v-model="edit.model.oldPwd"></el-input>
			</el-form-item>
			<el-form-item label="新密码：" prop="newPwd">
				<el-input v-model="edit.model.newPwd"></el-input>
			</el-form-item>
			<el-form-item label="确认新密码：" prop="checkPass">
				<el-input v-model="edit.model.checkPass"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm">提交</el-button>
				<el-button @click="resetForm">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: "ChangePwd",
                data(){
                        return {
                                edit: {
                                        model: {
                                                oldPwd: "",
                                                newPwd: "",
                                                checkPass: "",
                                        },
                                        rules: {
                                                oldPwd: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value === "")
                                                                        callback(new Error('*请输入原密码'));
                                                                else if(value.length < 3 || value.length > 20)
                                                                        callback(new Error('*密码长度为3-20'));
                                                                else
                                                                        callback();

                                                        },
                                                        trigger: "blur",
                                                }],
                                                newPwd: [{
                                                        validator: (rule, value, callback) =>{
                                                                if(value === "")
                                                                        callback(new Error('*请输入新密码'));
                                                                else if(value.length < 3 || value.length > 20)
                                                                        callback(new Error('*密码长度为3-20'));
                                                                else{
                                                                        if(this.edit.model.checkPass !== ''){
                                                                                this.$refs.ruleForm.validateField('checkPass');
                                                                        }
                                                                        callback();
                                                                }
                                                        },
                                                        trigger: "blur",
                                                }],
                                                checkPass: [
                                                        {
                                                                validator: (rule, value, callback) =>{
                                                                        if(value === ""){
                                                                                callback(new Error('*请再次输入新密码'));
                                                                        }else if(value !== this.edit.model.newPwd){
                                                                                callback(new Error('*两次输入密码不一致!'));
                                                                        }else{
                                                                                callback();
                                                                        }
                                                                }, trigger: "blur",
                                                        }
                                                ],
                                        }
                                }
                        }
                },
                methods: {
                        submitForm(){
                                this.$refs.ruleForm.validate(async valid =>{
                                        if(!valid) return;
                                        await this.$http({url: "/user/pwdchange", method: "post", data: this.edit.model});
                                        this.$message({
	                                        message: "密码修改成功",
	                                        type: "success"
                                        })

                                });
                        },
                        resetForm(){
                                this.$refs.ruleForm.resetFields();
                        }
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-form
		width: 400px
</style>