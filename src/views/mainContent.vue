<template>
    <div class="mainContainer">
        <div class="topMenuContainer">
            <span>StarDiscord</span>
        </div>
        <div class="bottomMenuContainer">
            <div class="leftContentContainer">
                <adminAvatar/>
                <serverList/>
                <searchServer/>
            </div>
            <div class="centerContentContainer">
                <div class="serverNameContainer">
                    <span>{{ serverStore.serverName }}</span>
                </div>
                <div class="channelListContainer" v-show="!userStore.showThisList">
                    <channelList/>
                </div>
                <div class="friendListContainer" v-show="userStore.showThisList">
                    <friendList/>
                </div>
            </div>
            <div class="rightContentContainer">
                <div class="chatContentTop">
                    <span> {{ activeStore.activeName }} </span>
                </div>
                <div class="chatContentBottom">
                    <chatContent/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="mainContent">
    //引入自定义组件
    import adminAvatar from '@/components/adminAvatar.vue';
    import serverList from '@/components/serverList.vue';
    import searchServer from '@/components/searchServer.vue';
    import channelList from '@/components/channelList.vue';
    import friendList from '@/components/friendList.vue';
    import chatContent  from '@/components/chatContent.vue';

    import { useServerStore } from '@/store/showServer';
    import { useUserStore } from '@/store/user';
    import { useGobalDataStore } from '@/store/globalData';
    import { useActiveChannelOrFriendStore } from '@/store/activeChannelOrFriend';
    import { useResponseDataStore } from '@/store/wsResponseData';
    import { useWebsocketStore } from '@/store/websocket';
    import { useFriendsStore } from '@/store/friendsData';
    import { useMessageStore } from '@/store/messageStore';
    
    import {onBeforeMount,onMounted,onUnmounted,watch,ref} from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    
    let userStore = useUserStore()
    let globalDataStore = useGobalDataStore()
    let serverStore = useServerStore()
    let activeStore = useActiveChannelOrFriendStore()
    let responseDataStore = useResponseDataStore()
    let websokcetStore = useWebsocketStore()
    let friendStore = useFriendsStore() 
    let messageStore = useMessageStore()
    const router = useRouter()

    
    //生命周期钩子
    onBeforeMount(() => {
        // 刷新时重新建立websocket连接
        if(websokcetStore.ws == null){
            websokcetStore.ws = new WebSocket("ws://119.45.223.167:8086/ws/")
            websokcetStore.ws.onopen = () => {
            console.log('Websocket reconnect success...')
        }
        }
        
        // 读取分配缓存内容
        // 用户信息
        let userinfo = JSON.parse(localStorage.getItem("userinfo") as string) 
        userStore.email = userinfo.email
        userStore.userID = userinfo.userid
        userStore.userName = userinfo.username
        userStore.userAvatar = userStore.prefixAvatar + String(Number(userinfo.userid) % 19 + '.png');

        //全局信息
        globalDataStore.userinfo.userID = userinfo.userid
        globalDataStore.userinfo.userName = userinfo.username
        globalDataStore.userinfo.userEmail = userinfo.email

        let serverinfo = JSON.parse(localStorage.getItem("serverinfo") as string)
        console.log("serverinfo",serverinfo)
        globalDataStore.serverInfo = serverinfo

        let friendsinfo = JSON.parse(localStorage.getItem("friendsinfo") as string)
        globalDataStore.friendInfo = friendsinfo

        // 初始化显示好友列表
        serverStore.serverName = userinfo.username
    })

    onUnmounted(() =>{
        // console.log('卸载')
        localStorage.clear()
        // router.replace('/login')
    })
</script>

<style scoped>

.mainContainer{
    width: 100%;
    height: 100%;
    background: rgb(30,31,34);
}
.topMenuContainer{
    width: 100%;
    height: 30px;
    color: antiquewhite;
}
.bottomMenuContainer{
    width: 100%;
    height: calc(100% - 30px);
    display: flex;
    flex-direction: row;
}
.leftContentContainer{
    width: 72px;
    height: 100%;
    /* display: flex;
    flex-direction: column; */
}
.centerContentContainer{
    width: 250px;
    height: 100%;
    background-color: rgb(43,45,49);
    border-top-left-radius: 15px;
}
.serverNameContainer{
    width: 100%;
    height: 55px;
    border-top-left-radius: 15px;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
}
.serverNameContainer span{
    color: antiquewhite;
    font-size: 21px;
    margin-left: 20px;
}
.channelListContainer{
    width: 100%;
    height: calc(100% - 57px);
}
.friendListContainer{
    width: 100%;
    height: calc(100% - 57px);
}
.rightContentContainer{
    width: calc(100% - 322px);
    height: 100%;
    background-color: rgb(49,51,56);
}
.chatContentTop{
    width: 100%;
    height: 55px;
    background-color: transparent;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
}
.chatContentTop span{
    color: antiquewhite;
    margin-left: 25px;
    font-size: 18px;
}
.chatContentBottom{
    width: 100%;
    height: calc(100% - 57px);
    /* background-color: antiquewhite */
}
</style>