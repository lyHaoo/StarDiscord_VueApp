<template>
  <div class="main">
    <router-view></router-view>
	<searchDialog v-show="dialogStore.searchDialogShow"/>
	<createServerDialog v-show="dialogStore.createServerShow"/>
	<createChannelDialog v-show="dialogStore.createChannelShow"/>
  </div>
</template>

<script setup lang="ts" name="app">
	import searchDialog from '@/components/dialogs/searchDialog.vue';
	import createServerDialog from '@/components/dialogs/createServerDialog.vue';
	import createChannelDialog from '@/components/dialogs/createChannelDialog.vue'
	import {ref} from 'vue';
	import {useDialogStore} from '@/store/dialogs';

	const dialogStore = useDialogStore()


</script>
<style scoped>
.main{
  height: 100vh;
  width: 100vw;
  /* 背景渐变色 - 原理2 */
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	/* 背景尺寸 - 原理3 */
    background-size: 600% 600%;
    /* 循环动画 - 原理4 */
	animation: gradientBG 5s ease infinite;
  /* background-color: antiquewhite */
}
/* 动画，控制背景 background-position */
@keyframes gradientBG {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
  }
</style>