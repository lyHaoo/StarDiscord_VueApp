<template>
    <div class="registContent">
        <div class="registContentContainer">
            <div class="avatarSelectContianer">
                <div class="avatarselect">
                    <img :src=userStore.userAvatar @click="openFileInput">
                    <input type="file" ref="fileInput" id="avatar" style="display: none" @change="handleFileChange">
                </div>
            </div>
            <div class="registInformationContainer">
                <input type="email" name="email" v-model="data.email" :class="{userExistClass:userIsExist}" placeholder="Email" @blur="queryUserExist">
                <input type="text" name="username" v-model="data.username" placeholder="username">
                <input type="password" name="password" id="pwd" v-model="data.password" placeholder="password">
                <input type="password" name="repassword" id="repwd" v-model="verifyPassword" :class="{samePassword:!samePassword}" placeholder="verify password" @blur="verifyPwd">
                <div class="captchaContainer">
                    <input type="text" name="captcha" v-model="captcha" class="captcha" placeholder="captcha">
                    <!-- <input type="button" class="captchaButton" value="获取验证码"> -->
                    <button class="captchaButton" @click="getCaptcha" :disabled="btnUse">GetCaptcha</button>
                </div>
                <!-- <input class="registButton" type="button" value="Sign Up" @click="signUp"> -->
                <button class="registButton" @click="signUp">Sign Up</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="regist">
    import {useRouter} from 'vue-router';
    import {useUserStore} from '@/store/user';
    import {ref,reactive,computed} from 'vue';
    import axios, { Axios } from 'axios';
    const userStore = useUserStore()
    const router = useRouter()
    
    // 数据
    const verifyPassword = ref<string>('')
    const userIsExist = ref<Boolean>(false)
    const samePassword = ref<boolean>(true)
    const captcha = ref<string>('')
    const birthdayData = Date.parse("2000-01-01T08:00:00.000Z");
    const timestamp = Date.now()

    let inputEmail = ref('')
    let inputUsername = ref('')
    let inputPassword = ref('')
    const time = ref(0)
    let btnUse = computed({
        get(){
            if(time.value != 0){
                return true
            }
            else{
                return false
            }
        },
        set(){}
    })

    let data = reactive({
        code:520001,
        username : '',
        password : '',
        email : '',
        gender : '保密',
        birthday : birthdayData,
        date : timestamp,
        captcha : captcha.value
    })

    // 方法
    function openFileInput(){
        // 打开文件选择
    }
    function queryUserExist(){
        // 查询用户是否存在  调用API
    }
    function handleFileChange(){
        // 改变头像文件
    }
    function verifyPwd(){
        // 验证两次密码是否相同
        if (verifyPassword.value === data.password){
            samePassword.value = true
        }
        else{
            samePassword.value = false
        }
        // console.log(verifyPassword.value === userStore.password)
    }
    function signUp(){
        if(captcha.value.length == 0 ){
            router.replace('/login')
        }
        if(samePassword.value){
            // 调用注册API进行注册
            console.log(data)
            axios.post("v1/sign/",data)
            .then((response => {
                // console.log(response.data)
                // console.log(response.data.status)
                if (response.data.status == 1){
                    userStore.email = data.email
                    userStore.userName = data.username
                    userStore.password = data.password
                    router.replace('/login')
                }
                else{
                    alert('注册失败!')
                }
            }))
            .catch((error =>{
                console.log(error)
            }))
        }else{
            alert('密码不一致')
        }
    }
    function getCaptcha(){
        axios.get('v1/captcha/',{
            headers:{
                code:530012,
                timestamp:Number(Date.now()),
                email:data.email
            }
        })
        .then((response => {
            if(response.data.status == 1){
                console.log(response.data)


                time.value = 30
                const interval = setInterval(() => {
                    if (time.value > 0) {
                        time.value--
                    } else {
                        clearInterval(interval)
                    }
                }, 1000)
            }
        }))
        .catch((error => {
            console.log(error)
        }))
    }
</script>

<style scoped>
.registContent{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.registContentContainer{
    width: 320px;
    height: 480px;
    background-color: rgb(30,31,34);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}


@keyframes blink {
  0% {
    border-color: red;
  }
  50% {
    border-color: white;
  }
  100% {
    border-color: red;
  }
}
.userExistClass{
    border: 2px solid red;
    animation: blink 1s infinite;
}
.samePassword{
    border: 2px solid red;
    animation: blink 1s infinite;
}
.avatarSelectContianer{
    width: 100%;
    height: 80px;
    /* background-color: aqua; */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
}
.avatarselect{
    width: 72px;
    height: 72px;
    /* background-color: blueviolet; */
    border-radius: 50%;
}
.avatarselect img{
    width: 70px;
    height: 70px;
    /* background-color: blueviolet; */
    border-radius: 50%;
    border: 1px solid white;
}
.registInformationContainer{
    width: 100%;
    height: 350px;
    /* background-color: antiquewhite; */
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.registInformationContainer input{
    width: 78%;
    height: 40px;
    border-radius: 10px;
    padding-left: 10px;
    font-size: 16px;
    text-align: center;
}
.captchaContainer{
    width: 82%;
}
.captchaContainer .captcha{
    width:53%;
}
.captchaContainer .captchaButton{
    width: 38%;
    height: 45px;
    border-radius: 10px;
    background-color: aqua;
    margin-left: 7px;
}
.registButton{
    width: 82%;
    height: 45px;
    border-radius: 10px;
    background-color: aqua;
}
</style>


