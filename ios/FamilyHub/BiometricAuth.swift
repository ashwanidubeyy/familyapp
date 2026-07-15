import Foundation
import LocalAuthentication

@objc(BiometricAuth)
class BiometricAuth: NSObject {

  @objc
  func authenticate(
    _ options: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {

    let context = LAContext()
    context.localizedCancelTitle = "Cancel"

    // Parse values from the options dictionary (matching Android fallbacks)
    let title = options["title"] as? String ?? "Authenticate"
    let subtitle = options["subtitle"] as? String ?? ""

    var error: NSError?

    // .deviceOwnerAuthentication allows both Biometrics and Device Passcode fallback
    guard context.canEvaluatePolicy(
      .deviceOwnerAuthentication,
      error: &error
    ) else {
      reject(
        "NOT_AVAILABLE",
        error?.localizedDescription ?? "Authentication unavailable",
        error
      )
      return
    }

    // iOS uses localizedReason to display why authentication is requested
    // If title/subtitle are both useful, you can concatenate them or use one.
    let reason = subtitle.isEmpty ? title : "\(title): \(subtitle)"

    context.evaluatePolicy(
      .deviceOwnerAuthentication,
      localizedReason: reason
    ) { success, authError in

      DispatchQueue.main.async {
        if success {
          resolve([
            "success": true,
            "authType": "unknown" 
          ])
        } else {
          // Handle specific iOS LocalAuthentication errors to match Android codes
          if let laError = authError as? LAError {
            switch laError.code {
            case .userCancel, .systemCancel, .appCancel:
              reject("USER_CANCEL", "User cancelled authentication", authError)
              return
            case .biometryLockout:
              reject("LOCKOUT", "Biometrics locked out due to too many attempts", authError)
              return
            case .biometryNotEnrolled:
              reject("NOT_ENROLLED", "Biometrics not set up on device", authError)
              return
            default:
              break
            }
          }
          
          reject(
            "AUTH_FAILED",
            authError?.localizedDescription ?? "Authentication failed",
            authError
          )
        }
      }
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}