<template>
    <div class="adminAvatarContainer">
        <div class="adminAvatar" id="menuContainer">
            <img :src="userStore.userAvatar" @click="clickUserAvatar" @contextmenu="showMenu($event)">
        </div>
    </div>
    <context-menu v-model:show="show" :options="optionsComponent">
        <context-menu-item label="创建服务器" @click="createServer()" />
        <context-menu-item label="刷新" @click="refresh()" />
    </context-menu>
</template>

<script setup lang="ts" name="adminAvatar">
    import { useUserStore } from '@/store/user';
    import { useServerStore } from '@/store/showServer';
    import { useResponseDataStore } from '@/store/wsResponseData';
    import { useDialogStore } from '@/store/dialogs';
    import { useGobalDataStore } from '@/store/globalData';
    import { useFriendsStore } from '@/store/friendsData';
    import {ContextMenu,ContextMenuItem,ContextMenuGroup,ContextMenuSeparator} from '@imengyu/vue3-context-menu';
    import type {MenuOptions } from '@imengyu/vue3-context-menu';
    import axios from 'axios';
    import {ref} from 'vue';

    const userStore = useUserStore()
    const serverStore = useServerStore()
    const responseDataStore = useResponseDataStore()
    const friendStore = useFriendsStore()
    const dialogStore = useDialogStore()
    const globalDataStore = useGobalDataStore()

    const show = ref(false)
    let optionsComponent = {
      zIndex: 3,
      minWidth: 180,
      x: 500,
      y: 200
    }

    function showMenu(e:MouseEvent){
        e.preventDefault();
        optionsComponent.x = e.x
        optionsComponent.y = e.y
        show.value = true;
    }

    function clickUserAvatar(){
        console.log('切换到私信...')
        serverStore.serverName = JSON.parse(localStorage.getItem("userinfo") as string).username
        userStore.showThisList = true
    }

    function createServer(){
        dialogStore.createServerShow = true
        console.log('创建服务器')
    }


    function refresh(){
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
</script>

<style scoped>
.adminAvatarContainer{
    width: 100%;
    height: 72px;
    position: relative;
    background: linear-gradient(to right, transparent 0%, rgb(255,255,255) 50%, rgb(0,0,0) 100%);
}
.adminAvatar{
    width: 100%;
    height: 71px;
    background-color: rgb(30,31,34);
    display: flex;
    justify-content: center;
    align-items: center;
}
img{
    width: 50px;
    height: 50px;
    border-radius: 45%;
    user-select: none;
}
</style>