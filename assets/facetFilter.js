document.addEventListener('DOMContentLoaded', () => {
    const facetForm = document.querySelector('.facets-form');
    const productGrid = document.querySelector('.product-grid');

    // Initially open first two facet filters
    const facetFilters = document.querySelectorAll('.facets-form details.facet');
    facetFilters.forEach((facet, index) => {
        if (index < 2) {
            facet.setAttribute('open', 'true');
        }
    });

    if (!facetForm) return;

    facetForm.addEventListener('change', (e) => {
        e.preventDefault();

        const url = new URL(window.location.href);

        [...url.searchParams.keys()].forEach(key => {
            if (key.startsWith('filter.')) {
                url.searchParams.delete(key);
            }
        });

        const checkedInputs = facetForm.querySelectorAll('input[type="checkbox"]:checked');
        const filterParams = new Map();
        checkedInputs.forEach(input => {
            if (input.name && input.value && input.name.startsWith('filter.')) {
                if (!filterParams.has(input.name)) {
                    filterParams.set(input.name, []);
                }
                filterParams.get(input.name).push(input.value);
            }
        });

        filterParams.forEach((values, name) => {
            values.forEach(value => {
                url.searchParams.append(name, value);
            });
        });

        const minPrice = facetForm.querySelector('input[name="filter.v.price.gte"]');
        const maxPrice = facetForm.querySelector('input[name="filter.v.price.lte"]');
        if (minPrice && minPrice.value) {
            url.searchParams.set(minPrice.name, minPrice.value);
        }
        if (maxPrice && maxPrice.value) {
            url.searchParams.set(maxPrice.name, maxPrice.value);
        }

        fetch(url.toString())
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Update product grid
                const newGrid = doc.querySelector('.product-grid');
                if (newGrid) {
                    productGrid.innerHTML = newGrid.innerHTML;
                }

                const newFacetForm = doc.querySelector('.facets-form');
                if (newFacetForm) {
                    facetForm.innerHTML = newFacetForm.innerHTML;
                }

                // Re-open facet filters: open if they contain any checked inputs or if they are among first two
                const updatedFacetFilters = facetForm.querySelectorAll('details.facet');
                updatedFacetFilters.forEach((facet, index) => {
                    const hasChecked = facet.querySelector('input[type="checkbox"]:checked') !== null;
                    if (hasChecked || index < 2) {
                        facet.setAttribute('open', 'true');
                    } else {
                        facet.removeAttribute('open');
                    }
                });


                window.history.replaceState(null, '', url.toString());
            })
            .catch(err => {
                console.error('Failed to update filters and products:', err);
                window.location.href = url.toString();
            });
    });
});