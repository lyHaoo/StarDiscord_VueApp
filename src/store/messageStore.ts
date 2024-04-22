import {defineStore} from 'pinia';

export interface message{
    index_id:number,
    chatid:number,
    data:{
        msg:string,
    }
    date:number,
    sender:number,
    type:number,
    userid:number
}
export interface youselfMessage{
    msgid:'',
    date:'',
    userid:'',
    type:'',
    id:'',//接收者ID
    data:{
        msg:''
    }
}
export const useMessageStore = defineStore('messageStopre',{
    state(){
        return{
            channelMessages:[] as message[],
            userMessages:[] as message[],
            myselfMessage:[] as youselfMessage[],
            showMsg:[] as any
        }
    }
})