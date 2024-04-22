<template>
    <div class="changePwdContainer">
        <div class="changePwdContent">
            <div class="title">
                <h2>忘记密码</h2>
            </div>
            <input type="text" name="email" placeholder="Email" v-model="email">
            <input type="password" name="changedPassword" placeholder="NewPassword" v-model="newPassword">
            <input type="password" name="reChangePassword" placeholder="ConfirmPassword" v-model="confirmPassword" :class="{samePassword:!samePassword}" @blur="verifyPwd">
            <div class="captchaContainer">
                <input type="text" name="captcha" placeholder="Captcha" v-model="captcha">
                <button @click="getCaptcha" :disabled="btnUse">GetCaptcha</button>
            </div>
            <button class="submitButton" @click="changePassword">Submit</button>
        </div>
    </div>
</template>
<script setup lang="ts" name="forgetPwd">
    import {useRouter} from 'vue-router';
    import { useUserStore } from '@/store/user';
    import {ref,computed} from 'vue';
    import axios from 'axios';
    // 创建路由器
    const router = useRouter()
    // 调用pinia
    const userStore = useUserStore()

    // 数据
    const newPassword = ref('')
    const email = ref('')
    const confirmPassword = ref('')
    const captcha = ref('')
    const samePassword = ref(true)
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


    // 方法
    function verifyPwd(){
        if (newPassword.value !== confirmPassword.value){
            samePassword.value = false
        }
        else{
            samePassword.value = true
        }
        // console.log(samePassword.value)
    }
    function getCaptcha(){
        // 获取验证码
        console.log('GetCaptcha')
        axios.get('v1/captcha/',{
            headers:{
                code:530012,
                timestamp:Number(Date.now()),
                email:email.value
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
    function changePassword(){
        userStore.email = email.value
        if (samePassword.value){
            // 修改数据库中的密码
            axios.post("v1/changepasswd/",{
                code:530007,
                date:Date.now(),
                email:email.value,
                password:newPassword.value,
                captcha:captcha.value
            })
            .then((response => {
                console.log(response.data)
            }))
            .catch((error => {
                console.log(error)
            }))
            // 跳转到登陆页面  需要根据后端返回结果再决定是否跳转
            userStore.password = newPassword.value
            router.replace('/')
        }
        else{
            alert('密码不一致')
        }
    }

    
</script>

<style scoped>
.changePwdContainer{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.changePwdContent{
    width: 320px;
    height: 480px;
    background-color: rgb(30,31,34);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.title{
    color:antiquewhite;
    margin-bottom: 20px;
}
.changePwdContent input{
    width: 78%;
    height: 40px;
    border-radius: 10px;
    padding-left: 10px;
    font-size: 16px;
    text-align: center;
    margin-bottom: 15px;
}
.captchaContainer{
    width: 82%;
}
.captchaContainer input{
    width: 53%;
}
.captchaContainer button{
    width: 38%;
    height: 45px;
    border-radius: 10px;
    background-color: aqua;
    margin-left: 7px;
}
.submitButton{
    width: 82%;
    height: 45px;
    border-radius: 10px;
    background-color: aqua;
}
/* 密码不一致样式 */
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
.samePassword{
    border: 2px solid red;
    animation: blink 1s infinite;
}
</style>