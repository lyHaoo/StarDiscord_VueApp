<template>
    <div class="friendListContent">
        <div class="friendContent" v-for="(key,value) in globalDataStore.friendInfo"
        :key="value"
        :class="{selected:selectKey === value}"
        @click="clickFriend(key,value)"
        @contextmenu="showMenu($event,value)">
            <img :src="userAvatar + value % 19 + '.png'">
            <span>{{ key }}</span>
        </div>
    </div>
    <context-menu v-model:show="show" :options="optionsComponent">
        <context-menu-item label="删除好友" @click="deleteFriend()" />
    </context-menu>
</template>

<script setup lang="ts" name="friendList">
    import { useUserStore } from '@/store/user';
    import { useGobalDataStore } from '@/store/globalData';
    import { useMessageStore } from '@/store/messageStore';
    import { useFriendsStore } from '@/store/friendsData';
    import type {message} from '@/store/messageStore'
    import { useActiveChannelOrFriendStore } from '@/store/activeChannelOrFriend';
    import {ContextMenu,ContextMenuItem,ContextMenuGroup,ContextMenuSeparator} from '@imengyu/vue3-context-menu';

    import {ref} from 'vue';    
    import axios from 'axios';
    import { sortBy } from 'lodash';
    const globalDataStore = useGobalDataStore()
    const activeStore = useActiveChannelOrFriendStore()
    const messageStore  = useMessageStore()
    const friendStore = useFriendsStore()

    const deleteUserID = ref()


    const selectKey = ref<number>()
    const show = ref(false)
    let optionsComponent = {
      zIndex: 3,
      minWidth: 180,
      x: 500,
      y: 200
    }

    const userAvatar = "http://119.45.223.167:8086/images/"

    // 方法
    function clickFriend(key:any,value:number){
        activeStore.activeName = key
        activeStore.activeID = value
        selectKey.value = value
        // console.log("click this friend...",value," ",key)
        axios.get(`v1/pullchats/?id=${activeStore.activeID}&page=1&pagesize=20`,{
            headers:{
                code:550001,
                timestamp:Number(Date.now()),
                token:localStorage.getItem("token")
            }
        })
        .then((response => {
            if(response.data.status == 1){
                console.log(response.data)
                const msgDate = response.data.data
                
                messageStore.userMessages = sortBy(msgDate,'date');
                messageStore.showMsg = messageStore.userMessages
            }
        }))
    }

    function showMenu(e:MouseEvent,value:any){
        e.preventDefault();
        deleteUserID.value = value
        optionsComponent.x = e.x
        optionsComponent.y = e.y
        show.value = true;
    }   

    // 删除好友

    function deleteFriend(){
        axios.post("v1/delfriend/",{
            code:530002,
            date:Date.now(),
            token:localStorage.getItem("token"),
            friendid:deleteUserID.value
        })
        .then((response => {
            console.log("deleteFriendRes",response)
            if(response.data.status == 1){
                alert("删除成功")
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
                        globalDataStore.serverInfo = JSON.parse(localStorage.getItem("serverInfo") as string)

                        //设置用户信息缓存
                        localStorage.setItem("userinfo",JSON.stringify({
                            userid:response.data.userid,
                            email:response.data.email,
                            username:response.data.username
                        }))

                        // 好友信息缓存
                        localStorage.setItem("friendsinfo",JSON.stringify(response.data.friends))
                        globalDataStore.friendInfo = JSON.parse(localStorage.getItem("friendsinfo") as string)
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
.friendListContent{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-color: antiquewhite; */
    overflow-x: hidden;
    overflow-y: auto;
}
.friendListContent::-webkit-scrollbar{
    width: 2px;
    /* background-color: antiquewhite; */
}
.friendListContent::-webkit-scrollbar-track{
    width: 2px;
    height: 100%;
    background-color: dimgrey;
}
.friendListContent::-webkit-scrollbar-thumb{
    width: 2px;
    background-color: black;
}
.friendContent{
    width: 90%;
    height: 55px;
    /* background-color: antiquewhite; */
    margin-top: 10px;
    display:flex;
    flex-direction: row;
    align-items: center;
    /* border: 1px solid black; */
    border-radius: 8px;
}
.friendContent:hover{
    background-color: rgb(64, 66, 73);
}
.friendContent img{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-left: 8px;
    user-select: none;
}
.friendContent span{
    margin-left: 10px;
    color: antiquewhite;
    font-size: 16px;
    margin-left: 10px;
}
.selected{
    background-color: rgb(64, 66, 73);
}


/* 右键菜单样式 */
.contextMenu-mask{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 45;
}
.contextMeunContainer{
    width: 200px;
    height: 50px;
    background-color: antiquewhite;
    position: fixed;
    top: 10px;
    left: 200px;
}
</style>