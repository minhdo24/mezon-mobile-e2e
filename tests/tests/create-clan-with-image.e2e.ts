import { CreateClanModalComponent } from "../screenobjects/home/components/create-clan-modal/create-clan-modal.component.js";
import { Media, sleep } from "../utils/index.js";

describe("Create Clan - Upload Image via Native Picker", () => {
    it("should upload an image and show preview", async () => {
        const assetPath = "./mezon-mobile-e2e/tests/assets/clan-avatar.png";

        await Media.addPhotoToDevice({ localPath: assetPath });

        await CreateClanModalComponent.using(async (modal) => {
            await modal.waitForVisible();
            await modal.uploadImageFromLibrary(assetPath);
            await modal.waitForPreview();
        });
    });
});
