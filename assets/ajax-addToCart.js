document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.getElementById("load-more");
  const productGrid = document.getElementById("product-grid");
  const cartOverlay = document.getElementById("cart-drawer-overlay");
  const cartDrawer = document.getElementById("cart-drawer");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  /* ---------------- CART DRAWER ---------------- */
  const closeCartDrawer = () => {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("active");
  };

  cartOverlay?.addEventListener("click", closeCartDrawer);

  const openCartDrawer = () => {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("active");
  };

  const attachCloseBtnEvent = () => {
    const newCloseBtn = cartDrawer.querySelector("#cart-drawer-close");
    if (newCloseBtn && !newCloseBtn.dataset.ajaxified) {
      newCloseBtn.dataset.ajaxified = true;
      newCloseBtn.addEventListener("click", closeCartDrawer);
    }
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

        // rebind events
        attachRemoveBtnEvents();
        attachCloseBtnEvent();
      }
    } catch (error) {
      console.error("Error updating cart drawer:", error);
    }
  };

  const attachRemoveBtnEvents = () => {
    const removeBtns = document.querySelectorAll(".remove-item-button");
    removeBtns.forEach((btn) => {
      if (btn.dataset.ajaxified) return; // avoid duplicate
      btn.dataset.ajaxified = true;

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

  /* ---------------- ADD TO CART ---------------- */
  const attachAddToCartEvents = () => {
    const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');

    addToCartForms.forEach((form) => {
      if (form.dataset.ajaxified) return; // avoid duplicate binding
      form.dataset.ajaxified = true;

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
          const formData = new FormData(form);
          const mainVariantId = formData.get("id");
          const quantity = formData.get("quantity") || 1;

          // collect line item properties (message, upload, cropped image)
          const properties = Object.fromEntries(
            [...formData].filter(([key]) => key.startsWith("properties["))
          );

          // collect add-ons
          const addonCheckboxes = form.querySelectorAll(".addon-checkbox:checked");
          const items = [
            {
              id: mainVariantId,
              quantity: Number(quantity),
              properties,
            },
          ];

          addonCheckboxes.forEach((cb) => {
            items.push({
              id: cb.dataset.variantId,
              quantity: 1,
            });
          });

          console.log('items', items);

          // add to cart
          await fetch("/cart/add.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ items }),
          });

          await updateCartDrawerHTML();
        } catch (error) {
          console.error("Error adding item to cart:", error);
        }
      });
    });
  };

  /* ---------------- LOAD MORE ---------------- */
  if (loadMoreBtn) {
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

        // re-bind AJAX events for new elements
        attachAddToCartEvents();
        callWishlist();
        updateRatingStars();

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
  }

  /* ---------------- WISHLIST ---------------- */
  const callWishlist = () => {
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");

    wishlistBtns.forEach((btn) => {
      if (btn.dataset.ajaxified) return;
      btn.dataset.ajaxified = true;

      const handle = btn.dataset.productHandle;
      if (wishlist.includes(handle)) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        if (wishlist.includes(handle)) {
          wishlist = wishlist.filter((item) => item !== handle);
          btn.classList.remove("active");
        } else {
          wishlist.push(handle);
          btn.classList.add("active");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      });
    });
  };

  function updateRatingStars() {
    if(document.querySelectorAll('.stars-fill').length > 0) {
      document.querySelectorAll('.stars-fill').forEach(el => {
        console.log(el);
        const rating = parseFloat(el.dataset.rating) || 0;
        const percentage = (rating / 5) * 100;
        el.style.width = `${percentage}%`
      })
    }
  }

  /* ---------------- INIT ---------------- */
  attachAddToCartEvents();
  attachRemoveBtnEvents();
  attachCloseBtnEvent();
  callWishlist();
  updateRatingStars();
});
