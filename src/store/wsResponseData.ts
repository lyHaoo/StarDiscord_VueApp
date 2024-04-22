import {defineStore} from 'pinia';
import {reactive} from 'vue';
export const useResponseDataStore = defineStore('responseDataStore',{
    state(){
        return{
            response:reactive({})
        }
    }
})