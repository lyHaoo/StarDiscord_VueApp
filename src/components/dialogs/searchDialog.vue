<template>
    <div class="searchContainer">
        <div class="searchContent">
            <div class="topMenu">
                <div class="closeContainer">
                    <i class="iconfont icon-guanbi" @click="closeThisWindow"></i>
                </div>
            </div>
            <div class="searchInputContainer">
                <div class="searchInput">
                    <input type="text" name="searchValue" v-model="searchKey" placeholder="输入用户ID或者ServerID">
                    <button @click="searchServerOrUser()">搜索</button>
                </div>
            </div>
            <div class="searchResultContainer">
                <div class="searchResult">
                    <searchResult v-show="dialogStore.searchServerAns" :ans="serverResult" :hide="hideServerAns"/>
                    <searchUserAns v-show="dialogStore.searchUserAns" :ans="userResult" :hide="hideUserAns"/>
                    <span v-show="notExit">用户或者服务器不存在</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="searchDialog">
    import searchResult from '@/components/searchResult.vue';
    import searchUserAns from '@/components/searchUserAns.vue';

    import {useDialogStore} from '@/store/dialogs';
    import axios from 'axios';
    import {ref,reactive} from 'vue';
    

    const dialogStore = useDialogStore()

    // 数据
    let searchKey = ref('')
    let notExit = ref(false)
    let resultEmpty = ref<boolean>(false)
    let showUserAns = ref<boolean>(false)

    const serverResult = reactive({
        serverName:'',
        serverID:'',
        serverAvatar:"",
    })

    const userResult = reactive({
        userid:'',
        username:'',
        userAvatar:""
    })

    // 方法
    function hideServerAns(){
        resultEmpty.value = false
    }
    function hideUserAns(){
        showUserAns.value = false
    }

    function closeThisWindow(){
        dialogStore.searchDialogShow = false
    }

    function searchServerOrUser(){
        // 调用API搜索用户或者服务器
        if(searchKey.value.length === 15)
        {
            searchServer(searchKey.value)
            searchKey.value = ''
        }
        else if(searchKey.value.length === 13){
            searchUser(searchKey.value)
            searchKey.value = ''
        }
    }
    function searchServer(serverID:string){
        axios.get(`v1/querychannel/?channelid=${serverID}`,{
                headers:{
                    code:530006,
                    timestamp:String(Date.now()),
                    token:localStorage.getItem("token"),
                }
            })
            .then((response => {
                console.log("搜索结果",response.data)
                serverResult.serverID = response.data.channelid
                serverResult.serverName = response.data.channelname
                serverResult.serverAvatar = "http://119.45.223.167:8086/images/"+ response.data.channelid % 19 + '.png';
                if(response.data.status == 1){
                    dialogStore.searchServerAns = true
                    notExit.value = false
                }else if(response.data.status == 2){
                    notExit.value = true 
                    dialogStore.searchServerAns = false
                }
            }))
            .catch((error => {
                console.log(error)
            }))
    }
    function searchUser(userid:string){
        axios.get(`/v1/queryuser/?id=${userid}`,{
                headers:{
                    code:530010,
                    timestamp:String(Date.now()),
                    token:localStorage.getItem("token"),
                }
            })
            .then((response => {
                console.log("搜索结果",response.data)
                userResult.userid = response.data.userid
                userResult.username = response.data.username
                userResult.userAvatar = "http://119.45.223.167:8086/images/" + response.data.userid % 19 + '.png';
                if(response.data.status == 1){
                    dialogStore.searchUserAns = true
                    notExit.value = false
                }else if(response.data.status == 2){
                    notExit.value = true 
                    dialogStore.searchUserAns = false
                }
            }))
            .catch((error => {
                console.log(error)
            }))
    }
</script>

<style scoped>
.searchContainer{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34,0.5);
    position: fixed;
    top: 0;
    left: 0;
}
.searchContent{
    width: 900px;
    height: 600px;
    position: absolute;
    left: calc(50% - 450px);
    top: calc(50% - 300px);
    background-color: rgb(30, 31, 34);
    border-radius: 25px;
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
.searchInput input::placeholder{
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
.searchResultContainer{
    width: 100%;
    height: calc(100% - 150px);
    /* background-color: aqua; */
    display: flex;
    justify-content: center;
    align-items: center;
}
.searchResult{
    width: 85%;
    height: 90%;
    /* background-color: antiquewhite; */
    border: 2px solid gray;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.searchResult span{
    margin-top: 50px;
    color: antiquewhite;
    font-size: 25px;
}
</style>