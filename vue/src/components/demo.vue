<template>
	<div>
		<button @click="$emit('abc', 100)">请问</button>
		<button @click="$emit('update:a', 100)">企鹅</button>
		<!--默认插槽-->
		<slot></slot>
		<!--具名插槽-->
		<div>
			<slot name="a1" name1="张三" age="18"></slot>
		</div>
		<div>
			<slot name="a2"></slot>
		</div>
		<div>
			<slot name="a3"></slot>
		</div>
		<div>
			<slot name="a4"></slot>
		</div>
		<div>
			<slot name="a5"></slot>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
        export default {
                name:"Demo",
	        prop: ["a","b"],
	        model: {
                        prop: "b",
		        event: "abc"
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>