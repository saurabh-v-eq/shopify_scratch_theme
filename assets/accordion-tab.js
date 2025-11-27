class AccordionTab extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.tabHeader = this.querySelector('[data-header]');
        this.tabContent = this.querySelector('[data-content]');

        this.tabHeader.addEventListener('click', this.handleToggle.bind(this));
    }

    disconnectedcallBack() {
        
    }

    handleToggle() {
        this.toggleAttribute('open');
    }
}
customElements.define("accordion-tab", AccordionTab);