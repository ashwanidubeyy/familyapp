package com.familyhub

import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*

class BiometricAuthModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

    private var pendingPromise: Promise? = null
    private var biometricPrompt: BiometricPrompt? = null

    init {
        reactContext.addLifecycleEventListener(this)
    }

    override fun getName(): String = "BiometricAuth"

    @ReactMethod
    fun authenticate(
        options: ReadableMap,
        promise: Promise
    ) {
        if (pendingPromise != null) {
            promise.reject(
                "AUTH_IN_PROGRESS",
                "Authentication is already running."
            )
            return
        }

        val activity = reactApplicationContext.currentActivity

        if (activity == null) {
            promise.reject(
                "NO_ACTIVITY",
                "Current activity is null."
            )
            return
        }

        if (activity !is FragmentActivity) {
            promise.reject(
                "INVALID_ACTIVITY",
                "Host Activity must extend FragmentActivity."
            )
            return
        }

        pendingPromise = promise

        val title = options.getString("title") ?: "Authenticate"
        val subtitle = options.getString("subtitle")

        // Runs UI/Fragment modifications safely on the Main thread
        activity.runOnUiThread {
            try {
                val executor = ContextCompat.getMainExecutor(activity)

                biometricPrompt = BiometricPrompt(
                    activity,
                    executor,
                    object : BiometricPrompt.AuthenticationCallback() {

                        override fun onAuthenticationSucceeded(
                            result: BiometricPrompt.AuthenticationResult
                        ) {
                            val map = Arguments.createMap()
                            map.putBoolean("success", true)
                            map.putString("authType", "unknown")

                            pendingPromise?.resolve(map)
                            clear()
                        }

                        override fun onAuthenticationFailed() {
                            // Handled natively by Android's prompt UI
                        }

                        override fun onAuthenticationError(
                            errorCode: Int,
                            errString: CharSequence
                        ) {
                            val code = when (errorCode) {
                                BiometricPrompt.ERROR_USER_CANCELED -> "USER_CANCEL"
                                BiometricPrompt.ERROR_NEGATIVE_BUTTON -> "USER_CANCEL"
                                BiometricPrompt.ERROR_CANCELED -> "CANCELED"
                                BiometricPrompt.ERROR_TIMEOUT -> "TIMEOUT"
                                BiometricPrompt.ERROR_LOCKOUT -> "LOCKOUT"
                                BiometricPrompt.ERROR_LOCKOUT_PERMANENT -> "LOCKOUT_PERMANENT"
                                BiometricPrompt.ERROR_NO_BIOMETRICS -> "NOT_ENROLLED"
                                BiometricPrompt.ERROR_NO_DEVICE_CREDENTIAL -> "DEVICE_CREDENTIAL_UNAVAILABLE"
                                BiometricPrompt.ERROR_HW_UNAVAILABLE -> "HARDWARE_UNAVAILABLE"
                                BiometricPrompt.ERROR_HW_NOT_PRESENT -> "NO_HARDWARE"
                                else -> "AUTH_ERROR"
                            }

                            pendingPromise?.reject(code, errString.toString())
                            clear()
                        }
                    }
                )

                val promptInfo = BiometricPrompt.PromptInfo.Builder()
                    .setTitle(title)
                    .apply {
                        subtitle?.let { setSubtitle(it) }
                    }
                    .setAllowedAuthenticators(BIOMETRIC_STRONG or DEVICE_CREDENTIAL)
                    .build()

                biometricPrompt?.authenticate(promptInfo)
            } catch (e: Exception) {
                pendingPromise?.reject("NATIVE_EXCEPTION", e.localizedMessage)
                clear()
            }
        }
    }

    private fun clear() {
        pendingPromise = null
        biometricPrompt = null
    }

    override fun onHostResume() {
        // No-op
    }

    override fun onHostPause() {
        // No-op
    }

    override fun onHostDestroy() {
        biometricPrompt?.cancelAuthentication()
        pendingPromise?.reject(
            "HOST_DESTROYED",
            "Authentication cancelled because host was destroyed."
        )
        clear()
    }

    override fun invalidate() {
        super.invalidate()
        reactApplicationContext.removeLifecycleEventListener(this)
        biometricPrompt?.cancelAuthentication()
        clear()
    }
}