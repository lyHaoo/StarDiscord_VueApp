<template>
    <div class="createServerContainer">
        <div class="createServerContent">
            <div class="topMenu">
                <div class="closeContainer">
                    <i class="iconfont icon-guanbi" @click="closeThisWindow"></i>
                </div>
            </div>
            <div class="DialogName">
                <span>创建服务器</span>
            </div>
            <div class="searchInputContainer">
                <div class="searchInput">
                    <input type="text" name="searchValue" v-model="serverName"
                    placeholder="请输入服务器名称">
                    <button @click="createServe()">创建</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="createServerDialog">
    import {ref,reactive} from 'vue';
    import { useDialogStore } from '@/store/dialogs';  
    import { useGobalDataStore } from '@/store/globalData';  
    import { useFriendsStore } from '@/store/friendsData';
    import axios from 'axios';

    const dialogStore = useDialogStore()
    const globlaData = useGobalDataStore()
    const friendStore = useFriendsStore()

    function closeThisWindow(){
        dialogStore.createServerShow = false
    }
    let serverName = ref('')

    // 创建服务器
    function createServe(){
        axios.post("v1/newchannel/",{    
            code:530003,
            date:String(Date.now()),
            token:localStorage.getItem("token"),
            channelname:serverName.value
        })
        .then((response => {
            console.log(response.data)
            if (response.data.status == 1){
                alert("创建成功")
                dialogStore.createServerShow = false
                // 刷新缓存
                axios.get(`v1/myselfinfo/?timestamp=${Date.now()}`,{
                    headers:{
                        code:530009,
                        token:localStorage.getItem("token")
                    }
                })
                .then((response => {
                    console.log("getUserinfo...")
                    console.log(response.data)
                    if(response.data.status == 1){
                        localStorage.setItem("responseData",JSON.stringify(response.data))

                        // 设置服务器信息缓存
                        localStorage.setItem("serverInfo",JSON.stringify(response.data.channels))
                        globlaData.serverInfo = JSON.parse(localStorage.getItem("serverInfo") as string)

                        //设置用户信息缓存
                        localStorage.setItem("userinfo",JSON.stringify({
                            userid:response.data.userid,
                            email:response.data.email,
                            username:response.data.username
                        }))

                        // 好友信息缓存
                        localStorage.setItem("friendsinfo",JSON.stringify(response.data.friends))
                        globlaData.friendInfo = JSON.parse(localStorage.getItem("friendsinfo") as string)
                        friendStore.friendList = JSON.parse(localStorage.getItem("friendsinfo") as string)
                    }
                })).catch((error => {
                    console.log(error)
                }))
            }
        }))
        .catch((error =>{
            console.log(error)
        }))

    }
</script>

<style scoped>
.createServerContainer{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34,0.5);
    position: fixed;
    top: 0;
    left: 0;
}
.createServerContent{
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