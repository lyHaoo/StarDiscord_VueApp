<template>
    <div class="searchResultContentContainer">
        <div class="leftResultContainer">
            <div class="serverAvatar">
                <img :src="ans.userAvatar">
            </div>
            <div class="serverInfo">
                <div class="resultName">
                    <span>{{ans.username}}</span>
                </div>
                <div class="resultID">
                    <span>{{ans.userid}}</span>
                </div>
            </div>
        </div>
        <div class="rightResultContainer">
            <button @click="addfriend()">添加</button>
        </div>
    </div>
</template>

<script setup lang="ts" name="searchUser">
    import axios from 'axios';
    import { useDialogStore } from '@/store/dialogs';
    import { useGobalDataStore } from '@/store/globalData';  
    import { useFriendsStore } from '@/store/friendsData';
    
    const dialogStore = useDialogStore()
    const globlaData = useGobalDataStore()
    const friendStore = useFriendsStore()

    const props = defineProps(['ans','hide'])
    function addfriend(){
        axios.post("v1/addfriend/",{
            code:530001,
            date:Date.now(),
            token:localStorage.getItem('token'),
            friendid:props.ans.userid
        })
        .then((response => {
            console.log(response.data)
            if(response.data.status == 1){
                alert("添加成功")
                dialogStore.searchUserAns = false
                dialogStore.searchDialogShow = false
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
    }

</script>

<style scoped>
.searchResultContentContainer{
    width: 90%;
    height: 75px;
    /* background-color: aqua; */
    background-color: rgba(49,51,56,1);
    border-radius: 15px;
    margin-top: 35px;
    display: flex;
    justify-content: space-between;
}
.leftResultContainer{
    width: 60%;
    height: 100%;
    /* background-color: antiquewhite; */
    border-radius: 15px;
    display: flex;
    flex-direction: row;
}
.rightResultContainer{
    width: 20%;
    height: 100%;
    /* background-color: antiquewhite; */
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.rightResultContainer button{
    width: 80px;
    height: 40px;
    border-radius: 15px;
    background-color: aqua;
    /* color: antiquewhite; */
    font-size: 16px;
    user-select: none;
}
.serverAvatar{
    height: 100%;
    width: 75px;
    /* background-color: aqua; */
    margin-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.serverAvatar img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    user-select: none;
}
.serverInfo{
    width: 70%;
    height: 100%;
    /* background-color: aquamarine; */
    margin-left: 15px;
    display: flex;
    flex-direction: column;
}
.resultName{
    width: 100%;
    height: 60%;
    /* background-color: aquamarine; */
    display: flex;
    align-items: center;
}
.resultName span{
    color: antiquewhite;
    font-size: 23px;
}
.resultID{
    width: 100%;
    height: 40%;
    /* background-color:blueviolet; */
    display: flex;
    align-items: center;
}
.resultID span{
    color: antiquewhite;
    font-size: 13px;
}
</style>