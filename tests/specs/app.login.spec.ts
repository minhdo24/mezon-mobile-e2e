import { MezonLoginScreen, AuthScreen } from "../screenobjects/index.js";
import { MailslurpLifecycle } from "../helpers/mailslurp.js";

describe("Mezon Login (WebView)", function () {
    let mezonLoginScreen: MezonLoginScreen;
    beforeEach(async () => {
        mezonLoginScreen = await MezonLoginScreen.using(async (ms) => {
            await ms.waitForIsShown(true);
            return ms;
        });
    });

    // it("Login with Email/Password (OAuth2 redirect has code)", async function () {
    //     const email = process.env.E2E_MEZON_EMAIL;
    //     const password = process.env.E2E_MEZON_PASSWORD;
    //     if (!email || !password) this.skip();

    //     await MezonLoginScreen.login(email!, password!);
    //     await AuthScreen.waitForUrlContains("code=");
    //     const code = await AuthScreen.getAuthQueryParam("code");
    //     await expect(code).toBeTruthy();
    // });

    it("Login with OTP via MailSlurp", async function () {
        if (!process.env.MAILSLURP_API_KEY) this.skip();

        await MailslurpLifecycle.using(
            async (ms) => {
                const emailAddress = await ms.getEmailAddress();
                await mezonLoginScreen.requestOtpFor(emailAddress);
                const otp = await ms.waitForOtp();
                await mezonLoginScreen.submitOtp(otp);
            },
            { cleanup: "delete" }
        );
        const authScreen = await AuthScreen.using(async (as) => {
            await as.waitForUrlContains("code=");
            return as;
        });
        const code = await authScreen.getAuthQueryParam("code");
        await expect(code).toBeTruthy();
    });
});
