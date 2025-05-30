document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.getElementById("load-more");
  const productGrid = document.getElementById("product-grid");
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener("click", async () => {
    const nextUrl = loadMoreBtn.getAttribute("data-next-url");
    if (!nextUrl) return;

    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Loading...";

    try {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const text = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      const newProducts = doc.querySelectorAll("#product-grid .product-card");

      newProducts.forEach((product) => {
        productGrid.appendChild(product);
      });

      const newLoadMoreBtn = doc.querySelector("#load-more");

      if (newLoadMoreBtn) {
        loadMoreBtn.setAttribute(
          "data-next-url",
          newLoadMoreBtn.getAttribute("data-next-url")
        );
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More";
      } else {
        loadMoreBtn.remove();
      }
    } catch (error) {
      console.error(error);
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = "Load More";
    }
  });
});