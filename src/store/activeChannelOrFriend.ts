import {defineStore} from 'pinia';

// 表示被选中的好友或者频道
export const useActiveChannelOrFriendStore = defineStore('activeCahnnel',{
    state(){
        return {
            activeName:'',
            activeID:Number(0),
            activeServerID:Number(0)
        }
    }
})