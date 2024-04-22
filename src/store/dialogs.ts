import {defineStore} from 'pinia'

export const useDialogStore = defineStore('dialog',{
    state(){
        return{
            searchDialogShow:false,
            createServerShow:false,
            createChannelShow:false,
            searchServerAns:false,
            searchUserAns:false,
            createTagChannelId:Number(0)
        }
    }
})