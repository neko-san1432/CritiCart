//filter data that is rejected
let rejected_products = [];
let x=''
function getRejectedItems(){
    let tmp = ''
    //logic here
    if(rejected_products.length==0){
        x='<div style="display: flex;width: inherit;height: 70%;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
    }else{
        x= tmp
    }
    showProducts()
}
function showProducts(){
    document.getElementById('rejected-products').innerHTML=x
}
getRejectedItems()