import { AppScreen } from "../AppScreen.js";

export class HomeScreen extends AppScreen {
    private constructor() {
        super("~Home-screen");
    }

    static init() {
        return new HomeScreen();
    }

    static async using<T>(fn: (hs: HomeScreen) => Promise<T>): Promise<T> {
        return fn(HomeScreen.init());
    }

    private get androidAnyEditText() {
        return $(
            'android=new UiSelector().className("android.widget.EditText")'
        );
    }

    private get iosAnyTextInput() {
        return $(
            '-ios predicate string:type == "XCUIElementTypeTextField" OR type == "XCUIElementTypeTextView"'
        );
    }

    private get accessibilityChatInputPrimary() {
        return $("~home-chat-input");
    }

    private get accessibilityChatInputAlt() {
        return $("~Home-ChatInput");
    }

    private get accessibilitySendButton() {
        return $("~home-send-button");
    }

    private get heuristicSendButtonAndroid() {
        return $('android=new UiSelector().descriptionContains("send")');
    }

    private get heuristicSendButtonIos() {
        return $(
            '-ios predicate string:label CONTAINS[c] "send" AND (type == "XCUIElementTypeButton" OR type == "XCUIElementTypeOther")'
        );
    }

    async waitForIsShown(isShown = true): Promise<boolean | void> {
        return driver.waitUntil(
            async () => {
                if (await this.accessibilityChatInputPrimary.isExisting())
                    return true;
                if (await this.accessibilityChatInputAlt.isExisting())
                    return true;
                if (driver.isAndroid) {
                    return this.androidAnyEditText.isExisting();
                }
                return this.iosAnyTextInput.isExisting();
            },
            {
                timeout: 45000,
                timeoutMsg: "Home not shown (chat input not found)",
            }
        );
    }

    private async locateChatInput(): Promise<any> {
        const accessibilityChatInputPrimaryExists =
            await this.accessibilityChatInputPrimary.isExisting();

        const accessibilityChatInputAltExists =
            await this.accessibilityChatInputAlt.isExisting();

        if (accessibilityChatInputPrimaryExists)
            return this.accessibilityChatInputPrimary;

        if (accessibilityChatInputAltExists)
            return this.accessibilityChatInputAlt;

        if (driver.isAndroid) {
            const elIsExisting = await this.androidAnyEditText.isExisting();
            if (!elIsExisting) throw new Error("Chat input not found");
            return this.androidAnyEditText as unknown as WebdriverIO.Element;
        }
        const elIsExisting = await this.iosAnyTextInput.isExisting();
        if (!elIsExisting) throw new Error("Chat input not found");
        return this.iosAnyTextInput as unknown as WebdriverIO.Element;
    }

    private async clickSend(): Promise<void> {
        const accessibilitySendButtonExists =
            await this.accessibilitySendButton.isExisting();
        if (accessibilitySendButtonExists) {
            return this.accessibilitySendButton.click();
        }
        if (driver.isAndroid) {
            const candidateExists =
                await this.heuristicSendButtonAndroid.isExisting();
            if (candidateExists) {
                return this.heuristicSendButtonAndroid.click();
            }
            return (driver as any).pressKeyCode?.(66);
        }
        const iosCandidateExists =
            await this.heuristicSendButtonIos.isExisting();
        if (iosCandidateExists) return this.heuristicSendButtonIos.click();
        return driver.execute("mobile: performEditorAction", {
            action: "done",
        });
    }

    async typeMessage(message: string): Promise<void> {
        const input = await this.locateChatInput();
        await input.waitForDisplayed({ timeout: 15000 });
        await input.click();
        await input.setValue(message);
    }

    async sendMessage(message: string): Promise<void> {
        await this.typeMessage(message);
        await this.clickSend();
    }
}
