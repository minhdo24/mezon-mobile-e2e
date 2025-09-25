export class Clipboard {
    static async setClipboardCrossPlatform(text: string): Promise<void> {
        if (driver.isIOS) {
            await driver.execute("mobile: setPasteboard", {
                content: Buffer.from(text, "utf8").toString("base64"),
                encoding: "utf8",
            });
            return;
        }

        if (driver.isAndroid) {
            try {
                await driver.setClipboard("plaintext", text);
                return;
            } catch {
                await driver.execute("mobile: shell", {
                    command: "am",
                    args: [
                        "broadcast",
                        "-a",
                        "clipper.set",
                        "-e",
                        "text",
                        text,
                    ],
                });
            }
            return;
        }

        await driver.setClipboard(text as any);
    }
}

export default Clipboard;
