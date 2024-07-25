/**
 * A class used to detect what device the User is using.
 */
class DeviceDetector {
  constructor() {
    throw new Error("DeviceDetector cannot be instantiated!");
  }

  /**
   * Attempts to detect whether the User is using a mobile device to use the Application.
   * @return {boolean} True if the User is using a mobile device, otherwise false.
   */
  static isMobileDevice() {
    console.log("Detecting device.");

    const pattern = /iPad|iPhone|iPod|Mobile Safari|Android|BlackBerry|Opera Mini|IEMobile/;
    return pattern.test(navigator.userAgent);
  }
}

export default DeviceDetector;
