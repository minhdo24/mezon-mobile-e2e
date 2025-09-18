import WebView, { CONTEXT_REF } from "../helpers/WebView.js";

export class MezonLoginScreen extends WebView {
    static init() {
        return new MezonLoginScreen();
    }

    static async using<T>(
        fn: (ms: MezonLoginScreen) => Promise<T>
    ): Promise<T> {
        return fn(MezonLoginScreen.init());
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

    private get emailInput() {
        return $('[data-testid="login-email-input"]');
    }
    private get sendOtpButton() {
        return $('[data-testid="login-send-otp-button"]');
    }
    private get otpInput() {
        return $('[data-testid="login-otp-input"]');
    }
    private get verifyButton() {
        return $('[data-testid="login-verify-otp-button"]');
    }
    private get loginWithOtpButton() {
        return $('[data-testid="login-with-otp-link"]');
    }

    async openLoginWithOtp(): Promise<void> {
        await this.switchToFirstWebview();
        await this.waitForDocumentFullyLoaded();
        try {
            if (await this.loginWithOtpButton.isExisting()) {
                await this.loginWithOtpButton.click();
            } else {
                await driver.execute(() => {
                    const doc = document as Document;
                    const candidates = Array.from(
                        doc.querySelectorAll('a,button,[role="button"]')
                    ) as HTMLElement[];
                    const norm = (s?: string | null) =>
                        (s || "").replace(/\s+/g, " ").trim().toLowerCase();
                    const labels = [
                        "login with otp",
                        "sign in with otp",
                        "continue with otp",
                        "send code",
                        "request code",
                        "get code",
                    ];
                    const found = candidates.find((el) => {
                        const t = norm(el.textContent);
                        const aria = norm(el.getAttribute("aria-label"));
                        return labels.some(
                            (l) => t.includes(l) || aria.includes(l)
                        );
                    });
                    if (!found)
                        throw new Error("login-with-otp element not found");
                    found.click();
                });
            }
        } finally {
            await this.switchBackToNative();
        }
    }

    async requestOtpFor(email: string): Promise<void> {
        await this.switchToFirstWebview();
        await this.waitForDocumentFullyLoaded();
        try {
            // Wait for email input to be present
            await driver.waitUntil(
                async () =>
                    (await driver.execute(() => {
                        const doc = document as Document;
                        const el =
                            doc.querySelector('input[type="email"]') ||
                            doc.querySelector(
                                '[data-testid="login-email-input"]'
                            ) ||
                            Array.from(doc.querySelectorAll("input")).find(
                                (e) => {
                                    const name = (
                                        e.getAttribute("name") || ""
                                    ).toLowerCase();
                                    const id = (
                                        e.getAttribute("id") || ""
                                    ).toLowerCase();
                                    const ph = (
                                        e.getAttribute("placeholder") || ""
                                    ).toLowerCase();
                                    const ac = (
                                        e.getAttribute("autocomplete") || ""
                                    ).toLowerCase();
                                    return (
                                        ac === "email" ||
                                        name.includes("email") ||
                                        id.includes("email") ||
                                        ph.includes("email")
                                    );
                                }
                            );
                        return !!el;
                    })) === true,
                { timeout: 45000, timeoutMsg: "Email input not found" }
            );

            // Fill email value
            await driver.execute((v: string) => {
                const doc = document as Document;
                const input =
                    (doc.querySelector(
                        'input[type="email"]'
                    ) as HTMLInputElement | null) ||
                    (doc.querySelector(
                        '[data-testid="login-email-input"]'
                    ) as HTMLInputElement | null) ||
                    (Array.from(doc.querySelectorAll("input")).find((e) => {
                        const name = (
                            e.getAttribute("name") || ""
                        ).toLowerCase();
                        const id = (e.getAttribute("id") || "").toLowerCase();
                        const ph = (
                            e.getAttribute("placeholder") || ""
                        ).toLowerCase();
                        const ac = (
                            e.getAttribute("autocomplete") || ""
                        ).toLowerCase();
                        return (
                            ac === "email" ||
                            name.includes("email") ||
                            id.includes("email") ||
                            ph.includes("email")
                        );
                    }) as HTMLInputElement | undefined) ||
                    null;
                if (!input) throw new Error("Email input not found");
                input.focus();
                input.value = "";
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.value = v;
                input.dispatchEvent(new Event("input", { bubbles: true }));
            }, email);

            // Wait for and click the send/continue button
            await driver.waitUntil(
                async () =>
                    (await driver.execute(() => {
                        const doc = document as Document;
                        const norm = (s?: string | null) =>
                            (s || "").replace(/\s+/g, " ").trim().toLowerCase();
                        const candidates = Array.from(
                            doc.querySelectorAll(
                                'button, a, input[type="submit"], [role="button"]'
                            )
                        ) as HTMLElement[];
                        const labels = [
                            "send code",
                            "send otp",
                            "continue",
                            "next",
                            "request code",
                            "get code",
                        ];
                        const found = candidates.find((el) => {
                            const txt =
                                norm(el.textContent) ||
                                norm(el.getAttribute("value"));
                            const aria = norm(el.getAttribute("aria-label"));
                            return labels.some(
                                (l) => txt.includes(l) || aria.includes(l)
                            );
                        });
                        return !!found;
                    })) === true,
                { timeout: 45000, timeoutMsg: "Send/Continue button not found" }
            );

            await driver.execute(() => {
                const doc = document as Document;
                const norm = (s?: string | null) =>
                    (s || "").replace(/\s+/g, " ").trim().toLowerCase();
                const candidates = Array.from(
                    doc.querySelectorAll(
                        'button, a, input[type="submit"], [role="button"]'
                    )
                ) as HTMLElement[];
                const labels = [
                    "send code",
                    "send otp",
                    "continue",
                    "next",
                    "request code",
                    "get code",
                ];
                const found = candidates.find((el) => {
                    const txt =
                        norm(el.textContent) || norm(el.getAttribute("value"));
                    const aria = norm(el.getAttribute("aria-label"));
                    return labels.some(
                        (l) => txt.includes(l) || aria.includes(l)
                    );
                });
                if (!found) throw new Error("Send OTP button not found");
                found.click();
            });
        } finally {
            await this.switchBackToNative();
        }
    }

    async submitOtp(otpCode: string): Promise<void> {
        await this.switchToFirstWebview();
        await this.waitForDocumentFullyLoaded();
        try {
            // Wait for OTP inputs/field to appear
            await driver.waitUntil(
                async () =>
                    (await driver.execute(() => {
                        const doc = document as Document;
                        const inputs = Array.from(
                            doc.querySelectorAll("input")
                        ) as HTMLInputElement[];
                        const isOtpLike = (el: HTMLInputElement) => {
                            const type = (
                                el.getAttribute("type") || ""
                            ).toLowerCase();
                            const name = (
                                el.getAttribute("name") || ""
                            ).toLowerCase();
                            const id = (
                                el.getAttribute("id") || ""
                            ).toLowerCase();
                            const aria = (
                                el.getAttribute("aria-label") || ""
                            ).toLowerCase();
                            const ph = (
                                el.getAttribute("placeholder") || ""
                            ).toLowerCase();
                            return (
                                ["text", "tel", "number", ""].includes(type) &&
                                (name.includes("otp") ||
                                    name.includes("code") ||
                                    id.includes("otp") ||
                                    id.includes("code") ||
                                    aria.includes("otp") ||
                                    aria.includes("code") ||
                                    ph.includes("otp") ||
                                    ph.includes("code"))
                            );
                        };
                        const single = inputs.filter(isOtpLike).filter((el) => {
                            const ml = parseInt(
                                el.getAttribute("maxlength") || "0",
                                10
                            );
                            return ml === 1 || (el as any).size === 1;
                        });
                        const field =
                            inputs.filter(isOtpLike)[0] ||
                            (doc.querySelector(
                                'input[type="tel"], input[type="text"]'
                            ) as HTMLInputElement | null) ||
                            (doc.querySelector(
                                '[data-testid="login-otp-input"]'
                            ) as HTMLInputElement | null);
                        return single.length > 0 || !!field;
                    })) === true,
                { timeout: 45000, timeoutMsg: "OTP input(s) not found" }
            );

            // Fill OTP
            await driver.execute((code: string) => {
                const doc = document as Document;
                const digits = code.split("");
                const inputs = Array.from(
                    doc.querySelectorAll("input")
                ) as HTMLInputElement[];
                const isOtpLike = (el: HTMLInputElement) => {
                    const type = (el.getAttribute("type") || "").toLowerCase();
                    const name = (el.getAttribute("name") || "").toLowerCase();
                    const id = (el.getAttribute("id") || "").toLowerCase();
                    const aria = (
                        el.getAttribute("aria-label") || ""
                    ).toLowerCase();
                    const ph = (
                        el.getAttribute("placeholder") || ""
                    ).toLowerCase();
                    return (
                        ["text", "tel", "number", ""].includes(type) &&
                        (name.includes("otp") ||
                            name.includes("code") ||
                            id.includes("otp") ||
                            id.includes("code") ||
                            aria.includes("otp") ||
                            aria.includes("code") ||
                            ph.includes("otp") ||
                            ph.includes("code"))
                    );
                };
                const otpInputs = inputs.filter(isOtpLike);
                const singleDigitInputs = otpInputs.filter((el) => {
                    const ml = parseInt(
                        el.getAttribute("maxlength") || "0",
                        10
                    );
                    return ml === 1 || (el as any).size === 1;
                });
                const setValue = (el: HTMLInputElement, v: string) => {
                    el.focus();
                    el.value = "";
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.value = v;
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                };
                if (singleDigitInputs.length >= digits.length) {
                    digits.forEach(
                        (d, i) =>
                            singleDigitInputs[i] &&
                            setValue(singleDigitInputs[i], d)
                    );
                } else {
                    const field =
                        (otpInputs[0] as HTMLInputElement | undefined) ||
                        (doc.querySelector(
                            '[data-testid="login-otp-input"]'
                        ) as HTMLInputElement | null) ||
                        (doc.querySelector(
                            'input[type="tel"], input[type="text"]'
                        ) as HTMLInputElement | null);
                    if (!field) throw new Error("OTP input not found");
                    setValue(field, code);
                }
            }, otpCode);

            await driver.waitUntil(
                async () =>
                    (await driver.execute(() => {
                        const doc = document as Document;
                        const norm = (s?: string | null) =>
                            (s || "").replace(/\s+/g, " ").trim().toLowerCase();
                        const candidates = Array.from(
                            doc.querySelectorAll(
                                'button, a, input[type="submit"], [role="button"]'
                            )
                        ) as HTMLElement[];
                        const labels = [
                            "verify",
                            "login",
                            "sign in",
                            "continue",
                            "submit",
                        ];
                        const found = candidates.find((el) => {
                            const txt =
                                norm(el.textContent) ||
                                norm(el.getAttribute("value"));
                            const aria = norm(el.getAttribute("aria-label"));
                            return labels.some(
                                (l) => txt.includes(l) || aria.includes(l)
                            );
                        });
                        return !!found;
                    })) === true,
                { timeout: 45000, timeoutMsg: "Verify/Login button not found" }
            );

            await driver.execute(() => {
                const doc = document as Document;
                const norm = (s?: string | null) =>
                    (s || "").replace(/\s+/g, " ").trim().toLowerCase();
                const candidates = Array.from(
                    doc.querySelectorAll(
                        'button, a, input[type="submit"], [role="button"]'
                    )
                ) as HTMLElement[];
                const labels = [
                    "verify",
                    "login",
                    "sign in",
                    "continue",
                    "submit",
                ];
                const found = candidates.find((el) => {
                    const txt =
                        norm(el.textContent) || norm(el.getAttribute("value"));
                    const aria = norm(el.getAttribute("aria-label"));
                    return labels.some(
                        (l) => txt.includes(l) || aria.includes(l)
                    );
                });
                if (!found) throw new Error("Verify OTP button not found");
                found.click();
            });
        } finally {
            await this.switchBackToNative();
        }
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

    async setEmail(value: string): Promise<void> {
        await this.switchToFirstWebview();
        await driver.execute((v: string) => {
            const doc = document as Document;
            const byPlaceholder = Array.from(
                doc.querySelectorAll("input,textarea")
            ).find((el) =>
                /email/i.test(el.getAttribute("placeholder") || "")
            ) as HTMLInputElement | undefined;
            const byId = (doc.getElementById("userEmail") ||
                doc.getElementById("email")) as HTMLInputElement | null;
            const target = (byId || byPlaceholder) as HTMLInputElement | null;
            if (!target) throw new Error("Email input not found");
            target.focus();
            target.value = "";
            target.dispatchEvent(new Event("input", { bubbles: true }));
            target.value = v;
            target.dispatchEvent(new Event("input", { bubbles: true }));
        }, value);
        await this.switchBackToNative();
    }

    async setPassword(value: string): Promise<void> {
        await this.switchToFirstWebview();
        await driver.execute((v: string) => {
            const doc = document as Document;
            const byPlaceholder = Array.from(
                doc.querySelectorAll("input")
            ).find((el) =>
                /password/i.test(el.getAttribute("placeholder") || "")
            ) as HTMLInputElement | undefined;
            const byId = doc.getElementById(
                "password"
            ) as HTMLInputElement | null;
            const target = (byId || byPlaceholder) as HTMLInputElement | null;
            if (!target) throw new Error("Password input not found");
            target.focus();
            target.value = "";
            target.dispatchEvent(new Event("input", { bubbles: true }));
            target.value = v;
            target.dispatchEvent(new Event("input", { bubbles: true }));
        }, value);
        await this.switchBackToNative();
    }

    async toggleShowPassword(): Promise<void> {
        await this.switchToFirstWebview();
        await driver.execute(() => {
            const doc = document as Document;
            const possible = Array.from(
                doc.querySelectorAll('input[type="checkbox"],button,label')
            ) as HTMLElement[];
            const show = possible.find((el) =>
                /show\s*password/i.test(
                    el.textContent || el.getAttribute("aria-label") || ""
                )
            ) as HTMLElement | undefined;
            if (show) (show as HTMLElement).click();
        });
        await this.switchBackToNative();
    }

    async submitLogin(): Promise<void> {
        await this.switchToFirstWebview();
        await driver.execute(() => {
            const doc = document as Document;
            const byText = Array.from(
                doc.querySelectorAll('button,input[type="submit"],a')
            ).find((el) =>
                /^(login|sign in)$/i.test((el.textContent || "").trim())
            ) as HTMLElement | undefined;
            const byId = (doc.getElementById("login") ||
                doc.querySelector("#sign-in")) as HTMLElement | null;
            const target = (byId || byText) as HTMLElement | null;
            if (!target) throw new Error("Login button not found");
            target.click();
        });
        await this.switchBackToNative();
    }

    async login(email: string, password: string): Promise<void> {
        await this.waitForIsShown(true);
        await this.setEmail(email);
        await this.setPassword(password);
        await this.submitLogin();
    }
}
