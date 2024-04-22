import {defineStore} from 'pinia'

export const useUserStore = defineStore('user',{
    state(){
        return {
            email:"",
            userID:Number(0),
            showThisList:true,
            userName:"",
            userAvatar:"",//此处应该有一个默认头像
            prefixAvatar:"http://119.45.223.167:8086/images/",
            // http://119.45.223.167:8086/images/std.png
            password:"",
            token:''

        }
    }
})