// import {
//     MezonLoginScreen,
//     BottomNavigator,
//     HomeTablet,
// } from "../screenobjects/index.js";
// import { createClanFlow, getLastCreatedClan, ClanInfo } from "../flows/create-clan.flow.js";
// import { MailslurpLifecycle } from "../helpers/mailslurp.js";
// import { sleep } from "../utils/sleep.js";

// describe("Create Clan E2E Tests", function () {
//     let createdClan: ClanInfo | null = null;

//     before(async function () {
//         // Login first if not already logged in
//         if (!process.env.MAILSLURP_API_KEY) {
//             console.log("⚠️  MAILSLURP_API_KEY not set, skipping login. Make sure user is already logged in.");
//         } else {
//             await MezonLoginScreen.using(async (ms) => {
//                 await ms.waitForIsShown(true);
                
//                 await MailslurpLifecycle.using(
//                     async (mailslurp) => {
//                         const emailAddress = await mailslurp.getEmailAddress();
//                         await ms.requestOtpFor(emailAddress);
//                         const otp = await mailslurp.waitForOtp();
//                         await ms.submitOtp(otp);
//                     },
//                     {
//                         reuse: true,
//                         cleanup: "empty",
//                         storageDir: ".mailslurp",
//                         storageKey: "login",
//                     }
//                 );
//             });
            
//             // Wait for login to complete
//             await sleep(3000);
//         }

//         // Navigate to home
//         await BottomNavigator.using(async (bn) => {
//             await bn.openHome();
//         });
//     });

//     it("Should create a new clan successfully", async function () {
//         const clanName = `Test Clan ${Date.now()}`;
        
//         console.log(`🚀 Starting to create clan: ${clanName}`);

//         // Use the create clan flow
//         createdClan = await createClanFlow({
//             clanName: clanName,
//             logToFile: true
//         });

//         console.log(`✅ Clan created successfully:`, createdClan);

//         // Verify clan was created
//         expect(createdClan).toBeDefined();
//         expect(createdClan?.name).toBe(clanName);
//         expect(createdClan?.createdAt).toBeDefined();
//         expect(createdClan?.testId).toBeDefined();

//         // Additional verification - check if we're now in the clan
//         await sleep(2000);
        
//         // Verify we can access the clan list and see our clan
//         await HomeTablet.tapDmLogo();
//         await HomeTablet.openClanList();
        
//         console.log(`✅ Successfully verified clan creation`);
//     });

//     it("Should validate clan name input", async function () {
//         console.log(`🧪 Testing clan name validation`);

//         // Open clan creation modal
//         await HomeTablet.tapDmLogo();
//         await HomeTablet.openClanList();
        
//         const createClanButton = await $("~listClanPopup.createClanButton");
//         await createClanButton.waitForDisplayed({ timeout: 15000 });
//         await createClanButton.click();

//         // Wait for create clan modal to appear
//         const modal = await $("~createClanModal.clanNameInput");
//         await modal.waitForDisplayed({ timeout: 15000 });

//         // Test empty name - create button should be disabled
//         const createButton = await $("~createClanModal.createButton");
//         await createButton.waitForDisplayed();
        
//         const isDisabledInitially = await createButton.getAttribute('enabled');
//         expect(isDisabledInitially).toBe('false');

//         // Enter valid name - create button should be enabled
//         const nameInput = await $("~createClanModal.clanNameInput");
//         await nameInput.click();
//         await nameInput.setValue("Valid Clan Name");

//         await sleep(1000); // Wait for validation

//         const isEnabledAfterInput = await createButton.getAttribute('enabled');
//         expect(isEnabledAfterInput).toBe('true');

//         // Close modal
//         const closeButton = await $("~createClanModal.closeButton");
//         await closeButton.click();
//         await modal.waitForDisplayed({ timeout: 5000, reverse: true });

//         console.log(`✅ Clan name validation test completed`);
//     });

//     after(async function () {
//         // Log created clan info for potential cleanup or reuse
//         if (createdClan) {
//             console.log(`📝 Created clan logged:`, createdClan);
            
//             // Also log the last created clan from file
//             const lastClan = getLastCreatedClan();
//             console.log(`📄 Last clan from log file:`, lastClan);
//         }
//     });
// });
