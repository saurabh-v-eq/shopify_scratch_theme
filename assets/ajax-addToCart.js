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
    try {
      const response = await fetch("/?section_id=cart-drawer");
      const text = await response.text();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = text;

      const newDrawer = tempDiv.querySelector("#cart-drawer");

      if (newDrawer) {
        cartDrawer.innerHTML = newDrawer.innerHTML;
        openCartDrawer();
        attachRemoveBtnEvents();
      }
    } catch (error) {
      console.error("Error updating cart drawer:", error);
    }
  };

  const attachRemoveBtnEvents = () => {
    const removeBtns = document.querySelectorAll(".remove-item-button");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        event.preventDefault();

        const lineItemIndex = btn.getAttribute("data-line");
        try {
          await fetch("/cart/change.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              line: lineItemIndex,
              quantity: 0,
            }),
          });

          await updateCartDrawerHTML();
        } catch (error) {
          console.log("Error removing item from cart", error);
        }
      });
    });
  };

  addToCartForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        await fetch("/cart/add.js", {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json",
          },
        });

        await updateCartDrawerHTML();
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    });
  });

  attachRemoveBtnEvents();
});
