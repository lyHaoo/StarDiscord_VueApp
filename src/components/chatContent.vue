<template>
    <div class="chatContentContainer">
        <div class="chatContent" id="chatDiv">
            <messageContent :msgs="messageStore.showMsg"/>
        </div>
        <div class="inputContainer">
            <div class="input">
                <textarea name="message" id="message" v-model="inputMessage" @keydown="onKeydown"></textarea>
            </div>
            <div class="button">
                <button id="button" @click="sendMessage()" :disabled="canClickSendBtn"><i class="iconfont icon-send"></i></button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import messageContent from '@/components/messageContent.vue';
    import {reactive,ref,nextTick,onUpdated,computed,onMounted} from 'vue';
    import {useActiveChannelOrFriendStore} from '@/store/activeChannelOrFriend'
    import { useUserStore } from '@/store/user';
    import { useMessageStore } from '@/store/messageStore';
    import { useWebsocketStore } from '@/store/websocket';
    import axios from 'axios';
    
    const activeChannelOrFriendStore = useActiveChannelOrFriendStore() //被选中的好友或者频道标签
    const userStore = useUserStore()    //或者已经登陆的用户信息
    const messageStore = useMessageStore()
    const webSocket = useWebsocketStore()

    const inputMessage = ref("")    //动态绑定输入框中的内容

    
    // 绑定输入框输入事件
    const onKeydown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('button').click();
      } else if (event.keyCode === 13 && event.shiftKey) {
        event.preventDefault();
        inputMessage.value += '\n'
      }
    }
    
    // 发送消息函数
    function sendMessage(){
        console.log(inputMessage.value);
        // 将消息推送到列表
        console.log(activeChannelOrFriendStore.activeID)
        if(activeChannelOrFriendStore.activeID.length == 13){
            sendToUser()
        }
        else{
            sendToTag()
        }
        inputMessage.value = ''
    }
    
    function sendToUser(){
        const newMessage ={
            code:610001,
            date:Date.now(),
            msgid:Date.now(),
            token:localStorage.getItem("token"),
            userid:userStore.userID,
            type:1,
            id:Number(activeChannelOrFriendStore.activeID),//接收者id
            data:{
                msg:inputMessage.value
            }
        }
        console.log("发送到用户",newMessage)

        window.ws.send(JSON.stringify(newMessage))
        const historyMsg = {
            index_id:0,
            chatid:newMessage.msgid,
            date:newMessage.date,
            data:{
                msg:newMessage.data.msg
            },
            sender:newMessage.userid,
            type:1
        }
        messageStore.userMessages.push(historyMsg)
        messageStore.showMsg =  messageStore.userMessages
    }
    function sendToTag(){
        const newMessage ={
            code:610001,
            date:Date.now(),
            msgid:Date.now(),
            token:localStorage.getItem("token"),
            userid:userStore.userID,
            type:2,
            id:Number(activeChannelOrFriendStore.activeServerID),//接收者id
            data:{
                msg:inputMessage.value,
                tag:activeChannelOrFriendStore.activeName
            }
        }
        console.log("发送到频道",newMessage)

        window.ws.send(JSON.stringify(newMessage))
        const historyMsg = {
            index_id:0,
            chatid:newMessage.msgid,
            date:newMessage.date,
            data:{
                msg:newMessage.data.msg
            },
            sender:newMessage.userid,
            type:2
        }
        messageStore.channelMessages.push(historyMsg)
        messageStore.showMsg =  messageStore.channelMessages
    }
    // 控制发送按钮是否可以点击
    let canClickSendBtn = computed({
        get(){
            if(inputMessage.value.length == 0 || activeChannelOrFriendStore.activeName.length == 0){
                return true
            }
            else{
                return false
            }
        }
    })


    let type = computed({
        get(){
            if(activeChannelOrFriendStore.activeID.length === 13){
                return 1
            }
            else if(activeChannelOrFriendStore.activeID.length === 15){
                return 2
            }
        }
    })
    // 钩子函数
    onMounted(() => {
    }),
    onUpdated(() => {
        // 更新时，滚动条保持在最下方
        nextTick(() => {
            const scrollArea = document.getElementById('chatDiv');
            scrollArea.scrollTop = scrollArea.scrollHeight;
        })
    })
</script>

<style scoped>
.chatContentContainer{
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    /* background-color: rgb(56,58,64); */
    /* background-color: antiquewhite; */
}
.chatContent{
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    /* background-color: aqua; */
    overflow-y: auto;
    overflow-x: hidden;
}
.chatContent::-webkit-scrollbar{
    width: 2px;
    /* background-color: antiquewhite; */
}
.chatContent::-webkit-scrollbar-track{
    width: 2px;
    height: 100%;
    background-color: dimgrey;
}
.chatContent::-webkit-scrollbar-thumb{
    width: 2px;
    background-color: black;
}
.inputContainer{
    width: calc(100% - 2px);
    height: calc(20% - 3px);
    background-color: rgb(56,58,64);
    border: 0.5px solid rgb(177, 177, 177);
    border-radius: 8px;
    /* background-color: aquamarine; */
}
.input{
    width: 100%;
    height: calc(100% - 30px);
    display: flex;
    justify-content: center;
    /* background-color: antiquewhite; */
}
.input textarea{
    width: 100%;
    height: 85%;
    resize: none;
    font-size: 18px;
    background-color: rgb(56,58,64);
    padding: 8px;
    border-radius: 8px;
    border: 0px;
    line-height: 1.5em;
    color: antiquewhite;
}
.input textarea:focus{
    outline: none;
}
.input textarea::-webkit-scrollbar {
  width: 8px;
}
.input textarea::-webkit-scrollbar-track{
    background:transparent;
}
.input textarea::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 20px;
}
.input textarea::-webkit-scrollbar{
    display: none;
}
.input textarea:hover::-webkit-scrollbar,
.input textarea:focus::-webkit-scrollbar{
    display: block;
}
.button{
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row-reverse;
    /* background-color: antiquewhite */
}
.button button{
    width: 110px;
    height: 28px;
    margin-right: 8px;
    margin-top: 0px;
    background-color: rgb(83, 84, 90);
    border-radius: 6px;
    color: aqua;
}
/* .button button:hover{
    background-color: rgb(100, 102, 109);
} */
</style>