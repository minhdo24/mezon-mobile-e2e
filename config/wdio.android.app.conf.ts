import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";

export const config: WebdriverIO.Config = {
    ...baseConfig,

    // ============
    // Specs
    // ============
    specs: ["../tests/specs/**/app*.spec.ts"],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // https://github.com/appium/appium-uiautomator2-driver
    capabilities: [
        {
            // The defaults you need to have in your config
            platformName: "Android",
            "wdio:maxInstances": 1,
            // For W3C the appium capabilities need to have an extension prefix
            // This is `appium:` for all Appium Capabilities which can be found here

            //
            // NOTE: Change this name according to the Emulator you have created on your local machine
            "appium:deviceName": "Pixel_8_Pro_Android_15_API_35",
            "appium:udid": "emulator-5554",
            "appium:avd": "Pixel_8_Pro_Android_15_API_35",
            //
            // NOTE: Change this version according to the Emulator you have created on your local machine
            "appium:platformVersion": "15.0",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "UiAutomator2",
            "appium:appWaitActivity": "com.mezon.mobile.MainActivity",
            "appium:appPackage": "com.mezon.mobile",
            "appium:appActivity": ".MainActivity",
            "appium:newCommandTimeout": 240,
            "appium:autoGrantPermissions": true,
            // fast start
            "appium:skipDeviceInitialization": true,
            "appium:skipServerInstallation": true,
            "appium:disableWindowAnimation": true,
            // keep data app to not login again (bypass persist)
            "appium:noReset": true,
            "appium:fullReset": false,
            "appium:autoLaunch": false,
            "appium:dontStopAppOnReset": true,
        },
    ],
};
