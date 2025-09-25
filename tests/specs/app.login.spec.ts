import { MezonLoginScreen } from "../screenobjects/index.js";
import { MailslurpLifecycle } from "../helpers/mailslurp.js";
import { sleep } from "../utils/sleep.js";

import { HomeScreen } from "../screenobjects/home/home.screen.js";

describe("Mezon Login (Native)", function () {
    let mezonLoginScreen: MezonLoginScreen;
    beforeEach(async () => {
        mezonLoginScreen = await MezonLoginScreen.using(async (ms) => {
            await ms.waitForIsShown(true);
            return ms;
        });
    });

    it.only("Login with OTP via MailSlurp", async function () {
        if (!process.env.MAILSLURP_API_KEY) this.skip();

        await MailslurpLifecycle.using(
            async (ms) => {
                const emailAddress = await ms.getEmailAddress();
                await mezonLoginScreen.requestOtpFor(emailAddress);
                const otp = await ms.waitForOtp();
                await mezonLoginScreen.submitOtp(otp);
            },
            {
                reuse: true,
                cleanup: "empty",
                storageDir: ".mailslurp",
                storageKey: "login",
            }
        );
        await sleep(5000);
        await HomeScreen.using(async (home) => {
            const createClanModal = await home.openCreateClanModal();
            await createClanModal.setClanName(`Test Clan${Date.now()}`);
            await createClanModal.uploadImage(async (upload) => {
                const smallAvatarPath = await upload.createFileWithSize(
                    `small_avatar_${Date.now()}`,
                    800 * 1024,
                    "jpg"
                );
                return smallAvatarPath;
            });
            await sleep(2000);
            await createClanModal.createClan();
        });
    });
});
