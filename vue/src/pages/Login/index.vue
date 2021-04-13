<template>
	<div class="container">
		<div class="logo-wrapper">
			<h1>黄海学院教学管理系统</h1>
		</div>
		<el-form :rules="rules" :model="user" ref="user">
			<h1>登录</h1>
			<el-form-item prop="user_name">
				<el-input suffix-icon="el-icon-s-custom" v-model="user.user_name">
					<template slot="prepend"><span class="prepend-text">用户名：</span></template>
				</el-input>
			</el-form-item>
			<el-form-item prop="user_pwd">
				<el-input suffix-icon="el-icon-lock" v-model="user.user_pwd" type="password">
					<template slot="prepend"><span class="prepend-text">密码：</span></template>
				</el-input>
			</el-form-item>
			<el-form-item class="login">
				<el-button type="info" plain @click="login">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name: "Login",
                data(){
                        return {
                                user: {
                                        user_name: "",
                                        user_pwd: ""
                                },
                                rules: {
                                        user_name: [
                                                {required: true, message: '请输入用户名', trigger: 'blur'},
                                                {min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur'}
                                        ],
                                        user_pwd: [
                                                {required: true, message: '请输入密码', trigger: 'blur'}
                                        ]
                                },
                        };
                },
                methods: {
                        async login(){
                                let token = await this.$http({
                                        url: "/user/login",
                                        method: "post",
                                        data: this.user
                                });
                                sessionStorage.setItem("token", token);
                                sessionStorage.setItem("user_name", this.user.user_name);
                                this.$router.replace('/home');
                        }
                }
        };
</script>

<style lang="stylus" type="text/stylus" scoped>
	@keyframes aaa
		0% { transform: rotateY(0deg)}
		100%{ transform: rotateY(30deg)}
	@keyframes bbb
		0% { transform: translateY(-50%) translateX(0%)}
		100%{ transform: translateY(-50%) translateX(30%)}

	.logo-wrapper
		perspective 500px
		position fixed
		top 45%
		right 40%
		transform: translateY(-50%) translateX(25%)

		h1
			animation-name: aaa
			animation-duration: 1s
			animation-fill-mode: forwards
			transform rotateY(30deg)
			transform-origin left center
			font-size 100px
			text-shadow -10px 10px 10px black
			white-space nowrap
			padding 20px 50px
			border-bottom 1px solid #000
			color: #008ae4
			position relative
			&:before
				content: "黄海学院教学管理系统"
				position absolute
				left 0
				top 100%
				padding 10px 50px
				transform scaleY(-1)

	.el-form

		width 400px
		padding 50px
		border-radius 10px
		position fixed
		top 50%
		left 60%
		transform: translateY(-50%)
		box-shadow 0 0 8px 1px
		h1
			text-align center
			font-size 25px
			margin-bottom 20px
		span.prepend-text
			display inline-block
			width 60px
		.login
			position relative
			left 43%
			text-align center
				el-button
				width 200px
</style>