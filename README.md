# Completion Status

Flow | Description | Status
--- | --- | ---
Oauth | Registration, OTP Verification, Login | Completed
Social Google | Registration, OTP Verification, Login | Yet to Start
Social Facebook | Registration, OTP Verification, Login | Yet to Start
Forget Password | Forget Password, OTP Verification, Change Password | Completed




Pending
-------
Keystore issue with firebase
Ref: https://medium.com/fullstack-with-react-native-aws-serverless-and/google-sign-in-for-react-native-android-7d43df78c082

Error
-----
FATAL EXCEPTION: main
Process: com.peatt, PID: 10431
java.lang.RuntimeException: Failure delivering result ResultInfo{who=null, request=64206, result=-1, data=Intent { (has extras) }} to activity {com.peatt/com.peatt.MainActivity}: java.lang.IllegalArgumentException: com.peatt: Targeting S+ (version 31 and above) requires that one of FLAG_IMMUTABLE or FLAG_MUTABLE be specified when creating a PendingIntent.
Strongly consider using FLAG_IMMUTABLE, only use FLAG_MUTABLE if some functionality depends on the PendingIntent being mutable, e.g. if it needs to be used with inline replies or bubbles.
	at android.app.ActivityThread.deliverResults(ActivityThread.java:5301)
	at android.app.ActivityThread.handleSendResult(ActivityThread.java:5340)
	at android.app.servertransaction.ActivityResultItem.execute(ActivityResultItem.java:54)
	at android.app.servertransaction.ActivityTransactionItem.execute(ActivityTransactionItem.java:45)
	at android.app.servertransaction.TransactionExecutor.executeCallbacks(TransactionExecutor.java:135)
	at android.app.servertransaction.TransactionExecutor.execute(TransactionExecutor.java:95)
	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2210)
	at android.os.Handler.dispatchMessage(Handler.java:106)
	at android.os.Looper.loopOnce(Looper.java:201)
	at android.os.Looper.loop(Looper.java:288)
	at android.app.ActivityThread.main(ActivityThread.java:7839)
	at java.lang.reflect.Method.invoke(Native Method)
	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:548)
	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1003)
Caused by: java.lang.IllegalArgumentException: com.peatt: Targeting S+ (version 31 and above) requires that one of FLAG_IMMUTABLE or FLAG_MUTABLE be specified when creating a PendingIntent.
Strongly consider using FLAG_IMMUTABLE, only use FLAG_MUTABLE if some functionality depends on the PendingIntent being mutable, e.g. if it needs to be used with inline replies or bubbles.
	at android.app.PendingIntent.checkFlags(PendingIntent.java:375)
	at android.app.PendingIntent.getBroadcastAsUser(PendingIntent.java:645)
	at android.app.PendingIntent.getBroadcast(PendingIntent.java:632)
	at com.facebook.AccessTokenManager.setTokenExpirationBroadcastAlarm(AccessTokenManager.java:164)
	at com.facebook.AccessTokenManager.setCurrentAccessToken(AccessTokenManager.java:130)
	at com.facebook.AccessTokenManager.setCurrentAccessToken(AccessTokenManager.java:110)
	at com.facebook.AccessToken.setCurrentAccessToken(AccessToken.java:245)
	at com.facebook.login.LoginManager.finishLogin(LoginManager.java:719)
	at com.facebook.login.LoginManager.onActivityResult(LoginManager.java:242)
	at com.facebook.login.LoginManager$1.onActivityResult(LoginManager.java:181)
	at com.facebook.internal.CallbackManagerImpl.onActivityResult(CallbackManagerImpl.java:81)
	at com.facebook.reactnative.androidsdk.FBActivityEventListener.onActivityResult(FBActivityEventListener.java:34)
	at com.facebook.react.bridge.ReactContext.onActivityResult(ReactContext.java:375)
	at com.facebook.react.ReactInstanceManager.onActivityResult(ReactInstanceManager.java:822)
	at com.facebook.react.ReactDelegate.onActivityResult(ReactDelegate.java:107)
	at com.facebook.react.ReactActivityDelegate.onActivityResult(ReactActivityDelegate.java:136)
	at com.facebook.react.ReactActivity.onActivityResult(ReactActivity.java:70)
	at android.app.Activity.dispatchActivityResult(Activity.java:8382)
	at android.app.ActivityThread.deliverResults(ActivityThread.java:5294)
	... 13 more
