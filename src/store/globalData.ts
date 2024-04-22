import { defineStore } from "pinia";

export interface server{
    userid:number
    channelid:number,
    channelname:string,
}
export const useGobalDataStore = defineStore('globalDate',{
    state() {
        return{
            userinfo:{
                userID:'',
                userName:'',
                userEmail:'',
            },
            serverInfo:[] as server[],
            friendInfo:[]
        }
    },
    
})