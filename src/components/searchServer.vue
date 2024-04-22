<template>
    <div class="searchServerContainer">
        <div class="searchContent" title="搜索" @click="showSearchDialog">
            <i class="iconfont icon-luopan"></i>
        </div>
    </div>
</template>

<script setup lang="ts" name="searchServer">
    import {useDialogStore} from '@/store/dialogs';
    const dialogStore = useDialogStore()

    function showSearchDialog(){
        dialogStore.searchDialogShow = true
    }
</script>

<style scoped>
.searchServerContainer{
    width: 100%;
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.searchContent{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: rgb(49,51,56);
     */
    background-color: antiquewhite;
    
}
.searchContent:hover{
    border-radius: 40%;
}
i{
    font-size: 30px;
    color: green;
}
</style>