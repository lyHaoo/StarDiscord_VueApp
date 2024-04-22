<template>
    <div class="loginContentContainer">
        <div class="loginContainer">
            <div class="userNameContainer" v-if="isShowUserName">
                    <div class="userName"><span>{{userStore.userName.replace(/"/g, '')}}</span></div>
                </div>
            <div class="userAvatarContainer"><div class="imgContainer"><img :src=defaultAvatar></div></div>
            <div class="userFormContainer">
                <input type="text" name="email" id="email" placeholder="Email" v-model="userStore.email" @blur="queryAvatar">
                <input type="password" name="password" placeholder="Password" v-model="userStore.password">
                <!-- <input type="submit" name="login" class="loginButton" value="Log In" @click="login"> -->
                <button @click="loginWs" class="loginButton">Log In</button>
            </div>
            <div class="moreSelectContainer">
                <div class="registAndMore">
                        <div class="regist"><a @click="toRegist">立即注册</a></div>
                        <div class="forgetPassword"><a @click="forgetPwd">忘记密码</a></div>
                </div></div>
        </div>
    </div>
</template>

<script setup lang="ts" name="login">
    import { useUserStore } from '@/store/user';
    import { useResponseDataStore } from '@/store/wsResponseData';
    import { useServerStore } from '@/store/showServer';
    import { useWebsocketStore } from '@/store/websocket';
    import { useMessageStore } from '@/store/messageStore';

    import {ref,onUnmounted,onMounted,watch} from 'vue';
    import { useRouter } from 'vue-router';


    let userStore = useUserStore()
    let responseDataStore = useResponseDataStore()
    let serverStore = useServerStore()
    let websocket = useWebsocketStore()
    let messageStore = useMessageStore()


    const router = useRouter()
    // 数据
    const isShowUserName = ref<Boolean>(false)
    const defaultAvatar = "http://119.45.223.167:8086/images/std.png"

    let responseData = ref()
    let wsSocket = ref()

    
    // 方法
    function loginWs(){
        let data = {
            code:610003,
            date:Date.now(),
            msgid:Date.now(),
            email:userStore.email,
            password:userStore.password
        }
        window.ws.send(JSON.stringify(data))
    }
    function login(){
        let data = {
            code:610003,
            date:Date.now(),
            msgid:Date.now(),
            email:userStore.email,
            password:userStore.password
        }
        console.log(data)
        wsSocket.value = new WebSocket("ws://119.45.223.167:8086/ws/")
        wsSocket.value.onopen = () => {
            console.log(wsSocket.value.readyState)
            let sendData = JSON.stringify(data)
            wsSocket.value.send(sendData)
            console.log('发送消息成功!建立连接')
        }
        wsSocket.value.onmessage = (message:any) => {
            responseData.value = JSON.parse(message.data)
            
            // 将数据进行缓存
            localStorage.setItem("responseData",JSON.stringify(responseData.value))
            // responseDataStore.response = JSON.parse(localStorage.getItem("responseData") as string)
            // userStore.email = responseData.value.email
            // userStore.userID = responseData.value.userid
            // userStore.userName = responseData.value.username
            // userStore.userAvatar += responseData.value.headimage
            // userStore.token = responseData.value.token

            // serverStore.serverName = responseData.value.username

            if(responseData.value.status == 1){
                router.replace('/index')
            }
        }
        wsSocket.value.onerror = (error:any) => {
            console.error(error);
        }
        
    }
    // 鼠标失去焦点后，获取头像
    function queryAvatar(){
        console.log('获取用户头像')
    }
    // 跳转到注册页面
    function toRegist(){
        router.replace('/regist')
    }
    // 跳转到忘记密码页面
    function forgetPwd(){
        router.replace('/forgetPwd')
    }


    // 监听

    //生命周期钩子
    onMounted(() => {
        window.ws = new WebSocket("ws://119.45.223.167:8086/ws/")
        window.ws.onopen = () => {
            console.log("Websocket success")
        }
        window.ws.onmessage = (message:any) => {
            let msg = JSON.parse(message.data)
            console.log("reveive:",msg)
            if (msg.code === 611003){
                //缓存整个响应信息
                localStorage.setItem("responseDate",JSON.stringify(msg))
                // 缓存token
                localStorage.setItem("token",msg.token)
                // 缓存用户信息
                const userinfo = {
                    userid:msg.userid,
                    username:msg.username,
                    email:msg.email
                }
                localStorage.setItem("userinfo",JSON.stringify(userinfo))
                // 缓存好友信息
                let friendsinfo =  msg.friends
                localStorage.setItem("friendsinfo",JSON.stringify(friendsinfo))
                // 缓存服务器信息
                let serverinfo = msg.channels
                localStorage.setItem("serverinfo",JSON.stringify(serverinfo))
                if(msg.status == 1){
                    router.replace('/index')
                }
                else{
                    alert("登陆失败，请重试！")
                }
            }
            else if(msg.code == 611001){
                console.log("reveive for channel",msg);
                let responseDate = {
                    code : 610004,
                    date:Number(Date.now()),
                    token:localStorage.getItem("token"),
                    userid:userStore.userID,
                    chatid:Number(msg.chatid)
                }
                // console.log(responseDate);
                window.ws.send(JSON.stringify(responseDate))
                if(msg.type == 1){
                    console.log("收到用户消息")
                    messageStore.userMessages.push(msg)
                }else if(msg.type == 2){
                    console.log("收到频道消息")
                    messageStore.channelMessages.push(msg)
                }
                
            }
        }
    })
    onUnmounted(() => {
        // console.log("被卸载了")
        // localStorage.clear()
    })
</script>

<style scoped>
.loginContentContainer{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.loginContainer{
    width: 320px;
    height: 480px;
    background-color: rgb(30,31,34);
    border-radius: 15px;
    /* border: 2px solid black; */
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.userNameContainer{
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.userNameContainer .userName{
    color: antiquewhite;
    font-size: 25px;
}
.userAvatarContainer{
    width: 100%;
    height: 120px;
    /* margin-top: 40px; */
    display: flex;
    justify-content: center;
    align-items: center;
}
.imgContainer{
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border:1px solid black;
    background-color: aqua;
    /* background-color: rgba(0, 0, 0,0); */
}
.imgContainer img{
    width: 110px;
    height: 110px;
    border-radius: 50%;
}
.userFormContainer{
    width: 100%;
    height: 190px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    /* background-color: bisque; */
}
.userFormContainer input{
    width: 78%;
    height: 45px;
    border-radius: 10px;
    padding-left: 10px;
    font-size: 16px;
    text-align: center;
    outline: none;
}
.userFormContainer button{
    width: 83%;
    height: 45px;
    border-radius: 10px;
    font-size: 16px;
    background-color: aqua;

}
.moreSelectContainer{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: blueviolet; */
}
.registAndMore{
    width: 165px;
    height: 15px;
    display: flex;
}
.regist{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(51, 236, 236);
    border-right: 1px solid wheat;
}
.regist a{
    color: rgb(51, 236, 236);
    text-decoration: none;
    user-select: none;
}
.forgetPassword{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(51, 236, 236);
}
.forgetPassword a{
    color: rgb(51, 236, 236);
    text-decoration: none;
    user-select: none;
}
</style>