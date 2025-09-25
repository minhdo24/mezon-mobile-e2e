// import { AuthScreen, BottomNavigator } from "../screenobjects/index.js";

// describe("Bottom Navigator - switch tabs", function () {
//     it("should switch between home | messages | notifications | profile tabs", async function () {
//         await AuthScreen.using(async (auth) => {
//             await auth.waitForAuthenticated();
//         });

//         await BottomNavigator.using(async (bn) => {
//             await bn.waitForIsShown(true);

//             const home = await bn.openHome();
//             await home.waitForIsShown(true);

//             const messages = await bn.openMessages();
//             await messages.waitForIsShown(true);

//             const notifications = await bn.openNotifications();
//             await notifications.waitForIsShown(true);

//             const profile = await bn.openProfile();
//             await profile.waitForIsShown(true);

//             // Go back to messages to ensure multiple switches work
//             const messagesAgain = await bn.openMessages();
//             await messagesAgain.waitForIsShown(true);
//         });
//     });
// });


