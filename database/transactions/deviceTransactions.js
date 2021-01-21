const { FadabHelper, queryAsync } = require("fadab-mysql-helper");

class DeviceTransactions extends FadabHelper {
  constructor() {
    super();
    this.baseTable = "tblDevice";
  }

  toggleDeviceStateAsync(deviceSecret) {
    return queryAsync("Call prDeviceToggle(?)", [deviceSecret]);
  }
}

module.exports = DeviceTransactions;
