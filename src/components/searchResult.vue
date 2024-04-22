<template>
    <div class="searchResultContentContainer">
        <div class="leftResultContainer">
            <div class="serverAvatar">
                <img :src="ans.serverAvatar">
            </div>
            <div class="serverInfo">
                <div class="resultName">
                    <span>{{ans.serverName}}</span>
                </div>
                <div class="resultID">
                    <span>{{ans.serverID}}</span>
                </div>
            </div>
        </div>
        <div class="rightResultContainer">
            <button @click="joinServer()">加入</button>
        </div>
    </div>
</template>

<script setup lang="ts" name="searchResult">
    import axios from 'axios';
    import { useDialogStore } from '@/store/dialogs';
    import { ref ,computed} from 'vue';

    const dialogStore = useDialogStore()

    
    const props = defineProps(['ans','hide'])

    function joinServer(){
        axios.post("v1/joinchannel/",{
            code:530004,
            date:Date.now(),
            token:localStorage.getItem("token"),
            channelid:props.ans.serverID
        })
        .then((response => {
            console.log(response.data)
            if (response.data.status == 1){
                alert('加入成功,请刷新列表')
                dialogStore.searchServerAns = false
                dialogStore.searchDialogShow = false
            }
        }))
        .catch((error => {
            console.log(error)
        }))
    }

</script>

<style scoped>
.searchResultContentContainer{
    width: 90%;
    height: 75px;
    /* background-color: aqua; */
    background-color: rgba(49,51,56,1);
    border-radius: 15px;
    margin-top: 35px;
    display: flex;
    justify-content: space-between;
}
.leftResultContainer{
    width: 60%;
    height: 100%;
    /* background-color: antiquewhite; */
    border-radius: 15px;
    display: flex;
    flex-direction: row;
}
.rightResultContainer{
    width: 20%;
    height: 100%;
    /* background-color: antiquewhite; */
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.rightResultContainer button{
    width: 80px;
    height: 40px;
    border-radius: 15px;
    background-color: aqua;
    /* color: antiquewhite; */
    font-size: 16px;
    user-select: none;
}
.serverAvatar{
    height: 100%;
    width: 75px;
    /* background-color: aqua; */
    margin-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.serverAvatar img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    user-select: none;
}
.serverInfo{
    width: 70%;
    height: 100%;
    /* background-color: aquamarine; */
    margin-left: 15px;
    display: flex;
    flex-direction: column;
}
.resultName{
    width: 100%;
    height: 60%;
    /* background-color: aquamarine; */
    display: flex;
    align-items: center;
}
.resultName span{
    color: antiquewhite;
    font-size: 23px;
}
.resultID{
    width: 100%;
    height: 40%;
    /* background-color:blueviolet; */
    display: flex;
    align-items: center;
}
.resultID span{
    color: antiquewhite;
    font-size: 13px;
}
</style>