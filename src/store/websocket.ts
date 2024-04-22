import {defineStore} from 'pinia';

export const useWebsocketStore = defineStore("websocketStore",{
    state(){
        return{
            ws:null as any,
            heartTimeOut: 10000,    //监测心跳时间 10秒
            msg : ""
        } 
    }
})