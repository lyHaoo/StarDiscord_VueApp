import {defineStore} from 'pinia';

export const useFriendsStore = defineStore('friendsStore',{
    state(){
        return{
            friendList:[]
        }
    }
})