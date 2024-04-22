<template>
    <div class="createChannelContainer">
        <div class="createChannelContent">
            <div class="topMenu">
                <div class="closeContainer">
                    <i class="iconfont icon-guanbi" @click="closeThisWindow"></i>
                </div>
            </div>
            <div class="DialogName">
                <span>创建频道</span>
            </div>
            <div class="searchInputContainer">
                <div class="searchInput">
                    <input type="text" name="searchValue" v-model="tagName"
                    placeholder="请输入频道名称">
                    <button @click="createTag()">创建</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="createChannelDialog">
    import {useDialogStore} from '@/store/dialogs';
    import { useServerStore } from '@/store/showServer';
    import {ref} from 'vue';
    import axios from 'axios';
    
    const dialogStore = useDialogStore()
    const serverStore = useServerStore()
    const tagName = ref('')

    function closeThisWindow(){
        dialogStore.createChannelShow = false
    }

    function createTag(){
        axios.post("v1/addtag/",{
            code:530013,
            date:Date.now(),
            token:localStorage.getItem("token"),
            channelid:dialogStore.createTagChannelId,
            tag:tagName.value
        })
        .then((response => {
            console.log(response.data)
            if(response.data.status == 1){
                serverStore.channelList = response.data.tags
                dialogStore.createChannelShow = false
            }
           
        }))
        .catch((error => {
            console.log(error)
        }))
    }
</script>

<style scoped>
.createChannelContainer{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34,0.5);
    position: fixed;
    top: 0;
    left: 0;
}
.createChannelContent{
    width: 900px;
    height: 400px;
    position: absolute;
    /* top: calc(50% - 450px);
    left: calc(50% - 300px); */
    left: calc(50% - 450px);
    top: calc(50% - 200px);
    background-color: rgb(30, 31, 34);
    border-radius: 30px;
}
.DialogName{
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: antiquewhite; */
}
.DialogName span{
    color: antiquewhite;
    font-size: 23px;
}
.topMenu{
    width: 100%;
    height: 30px;
    /* background-color: aqua; */
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
}
.closeContainer{
    width: 20px;
    height: 20px;
    margin-right: 10px;
}
i{
    font-size: 21px;
    color: antiquewhite;
}
.searchInputContainer{
    width: 100%;
    height: 90px;
    /* background-color: antiquewhite; */
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.searchInput{
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.searchInput input{
    width: 70%;
    height: 42px;
    border-radius: 15px;
    font-size: 16px;
    padding-left: 10px;
    background-color: rgb(96, 98, 102);
    color: antiquewhite;
    outline: none;
}
.searchInput input::placeholder {
    color: antiquewhite;
}
.searchInput button{
    width: 10%;
    height: 46px;
    border-radius: 15px;
    margin-left: 2px;
    background-color: aqua;
    font-size: 16px;
    user-select: none;
}
</style>