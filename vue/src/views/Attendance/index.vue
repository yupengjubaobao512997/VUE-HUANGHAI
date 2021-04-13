<template>
	<div>
		<el-upload ref="upload"
			accept=".jpg,.png"
			list-type="picture-card"
			name="avatar"
			:headers="uploadHeaders"
			:before-upload="beforeAvatarUpload"
			action="/student/avatarupload"
			:on-success="avatarUploadSuccess"
			:on-remove="avatarRemove"
		>
			<i class="el-icon-plus"></i>
			<p slot="tip">只能上传图片，并且最大不超过2M</p>
		</el-upload>
		<el-button type="primary" :disabled="avatarUpload.model.stu_avatar_new ===''">确定</el-button>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: "Attendance",
                data(){
                        return {
                                uploadHeaders: {'Authorization': sessionStorage.getItem("token")},
                                avatarUpload: {
                                        isUpload: false,
                                        model: {
                                                stu_id: 0,
                                                stu_avatar_old: null,
                                                stu_avatar_new: ""
                                        }
                                }
                        }
                },
                methods: {
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
                                                this.avatarUpload.model.stu_avatar_new = data;
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
                                this.avatarUpload.model.stu_avatar_new = "";
                        },
                        async aaa(){
                                await this.$http({
                                        method: "post",
                                        url: "/student/avatarupdate",
                                        data: this.avatarUpload.model
                                });
                                this.message.success("头像更新上传成功");
                                this.avatarUpload.isUpload = false;
				this.$refs.upload.clearFiles();
                        }
                }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>