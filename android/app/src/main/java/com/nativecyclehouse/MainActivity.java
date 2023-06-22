package com.nativecyclehouse;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.toyberman.RNSslPinningPackage;
// import com.reactlibrary.RNRootbeerPackage;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "nativeCyclehouse";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }
}
