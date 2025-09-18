import { HomeScreen } from "../screenobjects/index.js";

export class DeepLink {
    private readonly prefix = process.env.PREFIX;
    private readonly package = "com.mezon.mobile";
    private readonly realDeviceRegex = /^[a-f0-9]{25}|[a-f0-9]{40}$/i;

    static init() {
        return new DeepLink();
    }

    static async using<T>(fn: (dl: DeepLink) => Promise<T>): Promise<T> {
        return fn(DeepLink.init());
    }

    public async open(path: string) {
        return this.openDeepLink(path);
    }
    private async execute(url: string) {
        return driver.execute("mobile:deepLink", {
            url: `${this.prefix}${url}`,
            package: this.package,
        });
    }

    private isIosRealDevice() {
        return (
            "appium:udid" in driver.capabilities &&
            this.realDeviceRegex.test(
                driver.capabilities["appium:udid"] as string
            )
        );
    }

    private async openDeepLink(url: string) {
        if (driver.isAndroid) return this.execute(url);

        if (this.isIosRealDevice()) {
            await driver.execute("mobile: launchApp", {
                bundleId: "com.apple.mobilesafari",
            });
            const addressBarSelector = 'label == "Address" OR name == "URL"';
            const urlFieldSelector =
                'type == "XCUIElementTypeTextField" && name CONTAINS "URL"';
            const addressBar = $(`-ios predicate string:${addressBarSelector}`);
            const urlField = $(`-ios predicate string:${urlFieldSelector}`);

            if (!(await driver.isKeyboardShown())) {
                await addressBar.waitForDisplayed();
                await addressBar.click();
            }

            await urlField.setValue(`${this.prefix}${url}\uE007`);
        } else {
            await driver.url(`${this.prefix}${url}`);
        }

        try {
            const openSelector =
                "type == 'XCUIElementTypeButton' && name CONTAINS 'Open'";
            const openButton = $(`-ios predicate string:${openSelector}`);
            await openButton.waitForDisplayed({ timeout: 2000 });
            await openButton.click();
        } catch (e) {
            // ignore
        }
    }
    public async goToHome(query: string = "") {
        const q = query && !query.startsWith("?") ? `?${query}` : query;
        await this.open(`home${q}`);
        const hs = await HomeScreen.using(async (hs) => {
            await hs.waitForIsShown(true);
            return hs;
        });
        return hs;
    }

    public async goToChannelApp(
        code: string,
        query: string = ""
    ): Promise<void> {
        const q = query && !query.startsWith("?") ? `?${query}` : query;
        await this.open(`channel-app/${encodeURIComponent(code)}${q}`);
    }

    public async goToInvite(code: string): Promise<void> {
        await this.open(`invite/${encodeURIComponent(code)}`);
    }

    public async goToProfileChat(code: string): Promise<void> {
        await this.open(`chat/${encodeURIComponent(code)}`);
    }
}
