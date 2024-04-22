<template>
    <div class="channelListContent">
        <div class="channelContainer" 
        @contextmenu="showThisMenu"
        v-for="(channel,index) in serverStore.channelList" 
        :key = index
        :class="{selected:selectKey === index}"
        @click="selectChannel(channel,index)">
            <span>{{ channel }}</span>
        </div>
    </div>
</template>

<script setup lang="ts" name="channelList">
    import {useServerStore} from '@/store/showServer';
    import { useActiveChannelOrFriendStore } from '@/store/activeChannelOrFriend';
    import { useMessageStore } from '@/store/messageStore';

    import {ref} from 'vue';
    import axios from 'axios';
    import { sortBy } from 'lodash';

    let serverStore = useServerStore()
    const activeStore = useActiveChannelOrFriendStore()
    const messageStore = useMessageStore()

    let selectKey = ref<number>()
    let x = ref(0)
    let y = ref(0)
    let showMenu = ref<boolean>(false)
    



    // console.log('@@@@',channelList.value)

    function showThisMenu(e:any){
        showMenu.value = true
        e.preventDefault();

    }
    function selectChannel(channel:any,index:any){
        activeStore.activeName = channel
        activeStore.activeID = index
        selectKey.value = index
        console.log('被选中频道为 ',channel,' serverID为',activeStore.activeServerID,' tag为',activeStore.activeName)

        // 拉取消息记录
        axios.get(`v1/pullchats/?id=${activeStore.activeServerID}&page=1&pagesize=100`,{
            headers:{
                code:550001,
                timestamp:Number(Date.now()),
                token:localStorage.getItem("token"),
                tag:activeStore.activeName
            }
        })
        .then((response => {
            console.log(response.data)
            if(response.data.status == 1){
                
                const msgDate = response.data.data
                
                messageStore.channelMessages = sortBy(msgDate,'date')
                messageStore.showMsg = ''
                messageStore.showMsg = messageStore.channelMessages
            }
        }))
    }
</script>

<style scoped>
.channelListContent{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-color: antiquewhite; */
    /* 设置滚动条 */
    overflow-x: hidden;
    overflow-y: auto;
}
.channelListContent::-webkit-scrollbar{
    width: 2px;
    /* background-color: antiquewhite; */
}
.channelListContent::-webkit-scrollbar-track{
    width: 2px;
    height: 100%;
    background-color: dimgrey;
}
.channelListContent::-webkit-scrollbar-thumb{
    width: 2px;
    background-color: black;
}
.channelContainer{
    width: 90%;
    height: 30px;
    /* background-color: aliceblue; */
    margin-top: 10px;
    display: flex;
    align-items: center;
    border-radius: 8px;
}
.channelContainer:hover{
    background-color: rgb(64, 66, 73);
}
.channelContainer span{
    margin-left: 10px;
    color: antiquewhite;
}
.selected{
    background-color: rgb(64, 66, 73);
}
</style>