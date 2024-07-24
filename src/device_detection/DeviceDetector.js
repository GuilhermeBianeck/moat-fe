/**
 * A class used to detect what device the User is using.
 */
class DeviceDetector {
  constructor() {
    throw new Error("DeviceDetector cannot be initialised!");
  }

  /**
   * Attempts to detect whether the User is using a mobile device to use the Application.
   * @return A boolean representing true or false.
   */
  static isMobileDevice = () => {
    console.log("Detecting device.");

    let pattern = /iPad|iPhone|iPod|Mobile Safari/;
    let userAgent = navigator.userAgent;

    if (pattern.test(userAgent)) {
      return true;
    } else {
      return false;
    }
  };
}

export default DeviceDetector;
