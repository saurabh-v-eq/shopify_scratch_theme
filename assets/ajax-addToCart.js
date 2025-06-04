document.addEventListener("DOMContentLoaded", () => {
  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
  const cartOverlay = document.getElementById("cart-drawer-overlay");
  const cartDrawer = document.getElementById("cart-drawer");

  const closeCartDrawer = () => {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("active");
  };

  document.getElementById("cart-drawer-close")?.addEventListener("click", closeCartDrawer);
  cartOverlay?.addEventListener("click", closeCartDrawer);

  const openCartDrawer = () => {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("active");
  };

  const updateCartDrawerHTML = async () => {
    const response = await fetch("/?section_id=cart-drawer");
    const text = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    const newDrawer = tempDiv.querySelector("#cart-drawer");

    if (newDrawer) {
      cartDrawer.innerHTML = newDrawer.innerHTML;
      openCartDrawer();
    }
  };

  addToCartForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      await fetch("/cart/add.js", {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      await updateCartDrawerHTML();
    });
  });
});
