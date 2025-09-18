import WebView, { CONTEXT_REF } from "../helpers/WebView.js";

export class AuthScreen extends WebView {
    static init() {
        return new AuthScreen();
    }

    static async using<T>(fn: (auth: AuthScreen) => Promise<T>): Promise<T> {
        return fn(AuthScreen.init());
    }
    private constructor() {
        super();
    }

    async waitForIsShown(isShown = true): Promise<boolean | void> {
        const selector = browser.isAndroid
            ? "*//android.webkit.WebView"
            : "*//XCUIElementTypeWebView";

        return $(selector).waitForDisplayed({
            timeout: 45000,
            reverse: !isShown,
        });
    }

    async switchToFirstWebview(): Promise<void> {
        await this.waitForWebViewContextAdded();

        const contexts = await driver.getContexts({
            returnAndroidDescriptionData: true,
            returnDetailedContexts: true,
        });

        const webviewContext = contexts.find((ctx) => {
            const id = typeof ctx === "string" ? ctx : ctx?.id;
            return (
                typeof id === "string" && id.toUpperCase().startsWith("WEBVIEW")
            );
        });

        const contextId =
            typeof webviewContext === "string"
                ? webviewContext
                : webviewContext?.id;
        if (!contextId) {
            throw new Error("No WEBVIEW context found");
        }

        await driver.switchContext(contextId);
    }

    async switchBackToNative(): Promise<void> {
        await driver.switchContext(CONTEXT_REF.NATIVE_APP);
    }

    async getCurrentWebviewUrl(): Promise<string> {
        const originalContext = await driver.getContext();
        await this.switchToFirstWebview();
        const href = await driver.execute(() => window.location.href);
        originalContext
            ? await driver.switchContext(originalContext)
            : await this.switchBackToNative();

        return href;
    }

    async waitForUrlContains(part: string, timeout = 20000): Promise<void> {
        await this.switchToFirstWebview();
        await driver.waitUntil(
            async () => {
                const href = await driver.execute(() => window.location.href);
                return href.includes(part);
            },
            {
                timeout,
                timeoutMsg: `URL did not include "${part}" after ${timeout}ms`,
                interval: 250,
            }
        );
        await this.switchBackToNative();
    }

    async getAuthQueryParam(paramName = "code"): Promise<string | null> {
        await this.switchToFirstWebview();
        const href = await driver.execute(() => window.location.href);
        const query = href.split("?")[1] || "";
        const params = new URLSearchParams(query);
        const value = params.get(paramName);
        await this.switchBackToNative();
        return value;
    }
}
