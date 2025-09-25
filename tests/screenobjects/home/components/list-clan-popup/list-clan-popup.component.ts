import { SELECTOR } from "./constants/index.js";
import { CreateClanModalComponent } from "../create-clan-modal/index.js";

export class ListClanPopupComponent {
    private DEFAULT_TIMEOUT = 15000;
    private createClanModal: CreateClanModalComponent;

    private constructor() {
        this.createClanModal = CreateClanModalComponent.init();
    }

    static init(): ListClanPopupComponent {
        return new ListClanPopupComponent();
    }

    static async using<T>(
        fn: (c: ListClanPopupComponent) => Promise<T>
    ): Promise<T> {
        return fn(ListClanPopupComponent.init());
    }

    private async show(selector: string, timeout = this.DEFAULT_TIMEOUT) {
        const el = $(selector as string);
        await el.waitForExist({ timeout });
        await el.waitForDisplayed({ timeout });
        return el;
    }

    async waitForVisible(timeout = this.DEFAULT_TIMEOUT) {
        await this.show(SELECTOR.CREATE_BUTTON, timeout);
    }

    get list() {
        return $(SELECTOR.LIST);
    }

    get createButton() {
        return $(SELECTOR.CREATE_BUTTON);
    }

    async openCreateClanModal(){
        await this.createButton.click();
        await this.createClanModal.waitForVisible();
        return this.createClanModal;
    }

    async expectGroupPreviewVisibleFor(
        targetId: string,
        timeout = this.DEFAULT_TIMEOUT
    ) {
        const preview = await $(SELECTOR.PREVIEW_BY_TARGET_ID(targetId));
        await preview.waitForDisplayed({ timeout });
    }
}
