import { HomeScreen } from "../home.screen.js";

export async function sendChatMessage(message: string): Promise<void> {
    await HomeScreen.using(async (hs) => {
        await hs.waitForIsShown(true);
        await hs.sendMessage(message);
    });
}
