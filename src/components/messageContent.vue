<template>
    <div class="messageContentContainer" v-for="message in msgs">
        <div class="userInfoContainer">
            <img :src="userAvatar + String(message.sender % 19) + '.png'" >
            <span id="userName">{{ check(message.sender) }}</span>
            <span id="timestamp">{{ getDate(message.date) }}</span>
        </div>
        <div class="messageContent">
            <span>{{ message.data.msg }}</span>
        </div>
    </div>
</template>

<script setup>
    import {ref} from 'vue'; 
    import axios from 'axios';
    import { useGobalDataStore } from '@/store/globalData';
    import { useActiveChannelOrFriendStore } from '@/store/activeChannelOrFriend';
    defineProps(['msgs'])

    const globalDateStore = useGobalDataStore()
    const activeChannelOrFriend = useActiveChannelOrFriendStore()

    const userAvatar = "http://119.45.223.167:8086/images/"

    function check(userid){
        if(userid !== globalDateStore.userinfo.userID){
            return activeChannelOrFriend.activeName
        }
        else{
            return globalDateStore.userinfo.userName
        }
    }
    function getDate(timestamp){
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        return formattedDate
    }
</script>

<style scoped>
.messageContentContainer{
    width: 80%;
    margin-top: 10px;
    height: auto;
}
.userInfoContainer{
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* background-color: antiquewhite; */
    /* border: 1px solid black; */
}
.userInfoContainer img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 15px;
    user-select: none;
}
#userName{
    color: antiquewhite;
    font-size: 20px;
    margin-left: 15px;
    margin-right: 15px;
}
#timestamp{
    color: antiquewhite;
    font-size: 15px;
}
.messageContent{
    /* width: auto; */
    min-width: 80px;
    margin-top: 10px;
    margin-bottom: 5px;
    border-radius: 10px;
    padding-left: 15px;
    margin-left: 60px;
}
.messageContent:hover{
    background-color: rgb(64, 66, 73);
}
.messageContent span{
    white-space: pre;
    color: antiquewhite;
    line-height: 2em;
}
</style>