import {defineStore} from 'pinia'

export const useServerStore = defineStore('serverStore',{
    state(){
        return {
            serverName:'',
            serverID:Number(0),
            channelList:[],
            // channelNumber:0,
            descript:''
        }
    },
})