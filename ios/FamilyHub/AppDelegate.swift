import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  private var privacyView: UIVisualEffectView?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "GharConnect",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

 func applicationWillResignActive(_ application: UIApplication) {

    guard let window = window else { return }
    guard privacyView == nil else { return }

    let blur = UIBlurEffect(style: .systemChromeMaterial)

    let blurView = UIVisualEffectView(effect: blur)
    blurView.frame = window.bounds
    blurView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    privacyView = blurView

    window.addSubview(blurView)
}

func applicationDidBecomeActive(_ application: UIApplication) {

    guard let privacyView else {
        return
    }

    privacyView.removeFromSuperview()
    self.privacyView = nil
}
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
