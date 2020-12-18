const wdio = require('webdriverio');
const assert = require('assert');
const find = require('appium-flutter-finder');

const osSpecificOps = {
  platformName: process.argv[2],
  deviceName: process.argv[3],
  platformVersion: process.argv[4],
  app: process.argv[5],
};

const opts = {
  port: 4723,
  capabilities: {
    ...osSpecificOps,
    automationName: 'Flutter'
  }
};

(async () => {
  console.log(osSpecificOps);
  console.log('Initial app testing')

  const driver = await wdio.remote(opts);
  assert.strictEqual(await driver.execute('flutter:checkHealth'), 'ok');
  await driver.execute('flutter:clearTimeline');
  await driver.execute('flutter:forceGC');

  //Enter One page
  const btnLogin = find.byValueKey('btn-login');
  const inputUser = find.byValueKey('input-user');
  const inputPassword = find.byValueKey('input-password');

  await driver.execute('flutter:waitFor', btnLogin);
  await driver.elementSendKeys(inputUser, 'test@gmail.com')
  await driver.elementSendKeys(inputPassword, '123456')
  await driver.elementClick(btnLogin);

  //Enter Two page
  const textCount = find.byValueKey('count-key');
  const CustomWidget = find.byType('CustomTextExample');

  await driver.execute('flutter:waitFor', find.byType('Scaffold'));
  assert.strictEqual(await driver.getElementText(find.byText('Custom Widget')), 'Custom Widget');

  await driver.elementClick(CustomWidget);
  await new Promise(r => setTimeout(r, 100));
  assert.strictEqual(await driver.getElementText(textCount), '1');

  await driver.elementClick(CustomWidget);
  await new Promise(r => setTimeout(r, 100));
  assert.strictEqual(await driver.getElementText(textCount), '2');

  // return page
  await driver.elementClick(find.pageBack())

  driver.deleteSession();
})();