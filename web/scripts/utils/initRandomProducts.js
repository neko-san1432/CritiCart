//create db
//template for prod:
/* 
<div class="product-holder">
  <button class="toys-product10">
  --insert img, product name, & rating--</button>
</div> 
*/
//template for no products:
/*
  
*/
const foodSec = document.getElementById("food");
const cosmeticsSec = document.getElementById("cosmetics");
const appliancesSec = document.getElementById("appliances");
const hnwSec = document.getElementById("hnw");
const toySec = document.getElementById("toys");
var products = [[], [], [], [], []];
var food = "";
var cosmetics = "";
var toys = "";
var hnw = "";
var appliances = "";
function callDB() {}
function search_random_products() {
  if (products[0].length == 0) {
    foodSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
  if (products[1].length == 0) {
    cosmeticsSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
  if (products[2].length == 0) {
    appliancesSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
  if (products[3].length == 0) {
    hnwSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
  if (products[4].length == 0) {
    toySec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
}
search_random_products();
