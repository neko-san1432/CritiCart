import { supabase} from "../scripts/api/database.js"
async function searchProductsByTag(keyword) {
  // 1. Get all tags that match the input
  const { data: matchingTags, error: tagError } = await supabase
    .from("tags")
    .select("reviewid, tag")
    .ilike("tag", `%${keyword}%`);

  if (tagError) {
    console.error("Tag query error:", tagError.message);
    return [];
  }

  if (!matchingTags.length) return [];

  // 2. Group tags by product_id
  const groupedTags = matchingTags.reduce((acc, { product_id, tag }) => {
    if (!acc[product_id]) acc[product_id] = [];
    acc[product_id].push(tag);
    return acc;
  }, {});

  const productIds = Object.keys(groupedTags);

  // 3. Get matching products
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  if (productError) {
    console.error("Product fetch error:", productError.message);
    return [];
  }

  // 4. Attach matching tags to product
  const results = products.map(product => ({
    ...product,
    matching_tags: groupedTags[product.id] || [],
  }));

  return results;
}



document.getElementById("tagSearch").addEventListener("input", async (e) => {
  const keyword = e.target.value.trim();
  const resultsDiv = document.getElementById("searchResults");

  if (keyword.length < 2) {
    resultsDiv.innerHTML = "";
    return;
  }

  const products = await searchProductsByTag(keyword);

  if (!products.length) {
    resultsDiv.innerHTML = "<p>No matching products found.</p>";
    return;
  }

  resultsDiv.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="tags">
        ${p.matching_tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </div>
  `).join("");
});
