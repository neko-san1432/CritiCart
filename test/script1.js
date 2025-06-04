
import { supabase} from "../scripts/api/database.js"
async function fetchProductsByTag(tag) {
 
    // First, get product_ids from tags
  const { data: tagMatches, error: tagError } = await supabase
    .from('product_tags')
    .select('product_id')
    .eq('tag', tag);

  if (tagError) {
    console.error('Error fetching tag matches:', tagError);
    return;
  }

  const productIds = tagMatches.map(t => t.product_id);

  if (productIds.length === 0) {
    document.getElementById('productList').innerHTML = '<li>No matching products.</li>';
    return;
  }

  // Now get products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds);

  if (prodError) {
    console.error('Error fetching products:', prodError);
    return;
  }

  const ul = document.getElementById('productList');
  ul.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    ul.appendChild(li);
  });
}

// Run this on page load
const params = new URLSearchParams(window.location.search);
const tag = params.get('tag');
document.getElementById('tagHeader').textContent = `Items tagged with "${tag}"`;

if (tag) fetchProductsByTag(tag);
