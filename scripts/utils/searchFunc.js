//task: get the queued search function in the ChatGpt
import {supabase} from '../api/database.js'
const searchBar = document.getElementById('')
const {data:tags,error: retrieveTagsError} = await supabase.from("tags").select("tags").eq();
searchBar.addEventListener('input',()=>{
    searchBar.value
})

document.addEventListener('DOMContentLoaded',()=>{

})