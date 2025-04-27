let unreviewed_products = [];
let x = "";

function getUnreviewedProducts() {
  let tmp = ''
  //logic here
  if (unreviewed_products.length == 0) {
    x ='<div style="display: flex;width: inherit;height: 70%;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  } else {
    x= tmp
  }
  show();
}
function show() {
  document.getElementById("main-container").innerHTML = x;
}
console.log(unreviewed_products.length);
getUnreviewedProducts()