<template>
    <div class="serverListContainer">
        <div class="serverListContent" id="draggable">
            <!-- <img v-for="server in servers" :src="server.src" :key="server.serverID" :title="server.serverName" 
            :class="{selected:selectedServerID === server.serverID}"
            @click="" 
            draggable="true"
            > -->
            <img v-for="server in globlaData.serverInfo" :src="userStore.prefixAvatar + String(Number(server.channelid) % 19) + '.png'" :key="server.channelid" :title="server.channelname"
            :class="{selected:Number(server.channelid) === selectedServerID}"
            @click="selectServer(server)"
            @contextmenu="showContextMenu($event,server)">
        </div>
        <context-menu v-model:show="show" :options="optionsComponent">
            <context-menu-item label="显示ServerID" @click="showServerID()"/>
            <context-menu-item label="创建频道" @click="createChannel()" />
            <context-menu-item label="退出服务器"  @click="exitServer()" />
        </context-menu>
    </div>
</template>

<script setup lang="ts" name="serverList">
    import {reactive,ref,onMounted} from 'vue';
    import { useUserStore } from '@/store/user';
    import {useServerStore} from '@/store/showServer';
    import {useGobalDataStore } from '@/store/globalData'
    import { useDialogStore } from '@/store/dialogs';
    import { useFriendsStore } from '@/store/friendsData';
    import { useActiveChannelOrFriendStore } from '@/store/activeChannelOrFriend';
    import type {server} from '@/store/globalData';

    import {ContextMenu,ContextMenuItem,ContextMenuGroup,ContextMenuSeparator} from '@imengyu/vue3-context-menu';
    import axios from 'axios';


    const serverStore = useServerStore()
    const userStore = useUserStore()
    const globlaData = useGobalDataStore()
    const dialogStore = useDialogStore()
    const activeChannelOrFriend = useActiveChannelOrFriendStore()
    const friendStore = useFriendsStore()

    const selectedServerID = ref<number>()

    // 从缓存加载服务器数据
    // let servers = JSON.parse(localStorage.getItem("serverinfo") as string)
    // globlaData.serverInfo = servers
    
    const show = ref(false)
    const rightClickServerID = ref(0)
    let optionsComponent = {
      zIndex: 3,
      minWidth: 180,
      x: 500,
      y: 200
    }

    //方法
    function selectServer(server:server){
        selectedServerID.value = server.channelid
        // 显示频道列表窗口
        userStore.showThisList = false

        axios.get(`v1/channelinfo/?channelid=${server.channelid}`,{
            headers:{
                code:"530006",
                date:String(Date.now()),
                token:localStorage.getItem('token'),
            }
        }).then(response => {
            // console.log(response.data)
            serverStore.channelList = response.data.tags

        }).catch((error => {
            console.log(error)
        }))
        
        
        // 将选中的服务器信息绑定到pinia中
        serverStore.serverName = server.channelname
        serverStore.serverID = server.channelid
        serverStore.descript = `This is selected server. this is ${serverStore.serverName}`
        // serverStore.channelList = server.channelList
        // serverStore.channelNumber = server.channelNumber
        activeChannelOrFriend.activeServerID = server.channelid
        // console.log(serverStore)
        // 选中之后，获取该服务器的频道列表
        
    }

    function showContextMenu(e:any,server:server){
        e.preventDefault()
        rightClickServerID.value = server.channelid
        dialogStore.createTagChannelId = server.channelid
        // console.log(server.channelid)
        optionsComponent.x = e.x
        optionsComponent.y = e.y
        show.value = true
    }
    // 显示服务器ID
    function showServerID(){
        alert(rightClickServerID.value)
    }
    // 创建频道标签
    function createChannel(){
        dialogStore.createChannelShow = true
    }

    // 退出服务器
    function exitServer(){
        // console.log("退出服务器：",rightClickServerID.value);
        axios.post('v1/quitchannel/',{
            code:530005,
            date:Date.now(),
            token:localStorage.getItem('token'),
            operated:globlaData.userinfo.userID,
            channelid:rightClickServerID.value
        })
        .then((response => {
            console.log(response.data)
            if(response.data.status == 1){
                alert("退出成功")
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
            else{
                alert("这是您创建的频道。暂时无法退出")
            }
        }))
    }
    onMounted(() => {
        //初始化头像被选中状态
        
    })
    //计算属性
    
</script>

<style scoped>
.serverListContainer{
    width: 100%;
    height: calc(100% - 144px);
}
.serverListContent{
    width: calc(100% -2px);
    height: 100%;
    display:flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
}
.serverListContent::-webkit-scrollbar{
    width: 2px;
    /* background-color: antiquewhite; */
}
.serverListContent::-webkit-scrollbar-track{
    width: 2px;
    height: 100%;
    background-color: dimgrey;
}
.serverListContent::-webkit-scrollbar-thumb{
    width: 2px;
    background-color: black;
}
img{
    width: 50px;
    height: 50px;
    border-radius: 45%;
    margin: 8px;
}
img:hover{
    border-radius: 38%;
}
@keyframes border-flow {
  0% {
    border-color: red;
  }
  25% {
    border-color: orange;
  }
  50% {
    border-color: yellow;
  }
  75% {
    border-color: green;
  }
  100% {
    border-color: blue;
  }
}
.selected{
    border-radius: 38%;
    border: 2px solid transparent;
    animation: border-flow 5s infinite linear;
}
</style>