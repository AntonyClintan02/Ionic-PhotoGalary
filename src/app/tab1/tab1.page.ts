/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable no-console */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { App } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';
import { Browser } from '@capacitor/browser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor, CapacitorCookies, CapacitorHttp, HttpResponse, PluginListenerHandle } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Dialog } from '@capacitor/dialog';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Motion } from '@capacitor/motion';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { PushNotifications } from '@capacitor/push-notifications';
import { ScreenReader } from '@capacitor/screen-reader';
import { Share } from '@capacitor/share';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar , Style } from '@capacitor/status-bar';
import { TextZoom } from '@capacitor/text-zoom';
import { Toast } from '@capacitor/toast';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor() {}

  ngOnInit(){
    //------App---------------//
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
    });

    App.addListener('appUrlOpen', data => {
      console.log('App opened with URL:', data);
    });

    App.addListener('appRestoredResult', data => {
      console.log('Restored state:', data);
    });
    //----------------------------------------------------------------------//

    //---------------------------Network------------------------------------//
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
    });
    //----------------------------------------------------------------------//

    //---------------------------------screen reader----------------------------//
    ScreenReader.addListener('stateChange', ({ value }) => {
      console.log(`Screen reader is now ${value ? 'on' : 'off'}`);
    });
    //--------------------------------------------------------------------------//


    //-----------------------------statusBar------------------------------------//
    const statusBar = Capacitor.isPluginAvailable('StatusBar');
    if(statusBar){
      // iOS only
      window.addEventListener('statusTap', function() {
        console.log('statusbar tapped');
      });

      // Display content under transparent status bar (Android only)
      StatusBar.setOverlaysWebView({ overlay: true });
    }

    //--------------------------------------------------------------------------//
  }



//-------------------------------Action Sheet ------------------------------//
  async showActions() {
    const result = await ActionSheet.showActions({
      title: 'Photo Options',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Upload',
        },
        {
          title: 'Share',
        },
        {
          title: 'Cancel',
          icon:'arrow-back-outline',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    console.log('Action Sheet result:', result);
  };
//------------------------------------------------------------------------------//

//-------------------------------App Launcher-----------------------------------//

  checkCanOpenUrl = async () => {
    const { value } = await AppLauncher.canOpenUrl({ url: 'com.getcapacitor.myapp' });
    console.log('Can open url: ', value);
  };

  openPortfolioPage = async () => {
    await AppLauncher.openUrl({ url: 'com.getcapacitor.myapp://page?id=portfolio' });
  };
//-------------------------------------------------------------------------------//

//------------------------------Browser------------------------------------------//
  openCapacitorSite = async () => {
    await Browser.open({ url: 'http://capacitorjs.com/' });

    setTimeout(()=>{
      Browser.close();
    },2000);
  };
//--------------------------------------------------------------------------------//

//-----------------------------Camera ---------------------------------------------//

  takePicture = async () => {
    const imageURL = document.getElementById('img') as HTMLImageElement;
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    imageURL.src = await image.webPath;
  };

  photos =[];
  getPhotos= async () => {
    const images = await Camera.pickImages({
      quality:90,
    });
    this.photos = images.photos;
    console.log(this.photos);
  };

  //---------------------------------------------------------------------------------//

  //------------------------------Clipboard-------------------------------------------//

  writeToClipboard = async () => {
    // clipboard means copy test or file
    await Clipboard.write({
      string: "Hello World!",
    });
  };

  checkClipboard = async () => {
    const { type, value } = await Clipboard.read();
    console.log(`Got ${type} from clipboard: ${value}`);
  };

  //------------------------------------------------------------------------------------//

  //---------------------------------Cookies--------------------------------------------//

  getCookies = () => {
    console.log(document.cookie);
  };

  setCapacitorCookie = async () => {
    await CapacitorCookies.setCookie({
      url: 'http://example.com',
      key: 'language',
      value: 'en',
    });
    this.getCookies();
  };

  deleteCookie = async () => {
    await CapacitorCookies.deleteCookie({
      url: 'https://example.com',
      key: 'language'
    });
    this.getCookies();
  };

  clearCookiesOnUrl = async () => {
    await CapacitorCookies.clearCookies({
      url: 'https://example.com',
    });
    this.getCookies();
  };

  clearAllCookies = async () => {
    await CapacitorCookies.clearAllCookies();
    this.getCookies();
  };
//-----------------------------------------------------------------------------------//

//-------------------------------- Device -------------------------------------------//
  logDeviceInfo = async () => {
    const info = await Device.getInfo();
    console.log(info);
  };

  logBatteryInfo = async () => {
    const info = await Device.getBatteryInfo();
    console.log(info);
  };

//---------------------------------------------------------------------------------//

//---------------------------------Dialog -----------------------------------------//
  showAlert = async () => {
    await Dialog.alert({
      title: 'Stop',
      message: 'this is an error',
    });
  };

  showConfirm = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `Are you sure you'd like to press the red button?`,
    });

    console.log('Confirmed:', value);
  };

  showPrompt = async () => {
    const { value, cancelled } = await Dialog.prompt({
      title: 'Hello',
      message: `What's your name?`,
    });

    console.log('Name:', value);
    console.log('Cancelled:', cancelled);
  };
//-----------------------------------------------------------------------------------//

//-----------------------------FileSystem --------------------------------------------//

  writeSecretFile = async () => {
    await Filesystem.writeFile({
      path: 'secrets/text.txt',
      data: "This is a test",
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  };

  readSecretFile = async () => {
    const contents = await Filesystem.readFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    console.log('secrets:', contents);
  };

  deleteSecretFile = async () => {
    await Filesystem.deleteFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
    });
  };

  readFilePath = async () => {
    const contents = await Filesystem.readFile({
      path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
    });

    console.log('data:', contents);
  };

  //--------------------------------------------------------------------------------------//


  //----------------------------- Geolocation --------------------------------------------//
  printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
  };
  //--------------------------------------------------------------------------------------//

  //-------------------------------Google Map --------------------------------------------//

  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  maptrigger = false;
  async getGooleMap() {
    this.maptrigger = !this.maptrigger;
    if(this.maptrigger){
      const coordinates = await Geolocation.getCurrentPosition();
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef.nativeElement,
        apiKey: environment.apiKey,
        config: {
          center: {
            lat:coordinates.coords.latitude,
            lng:coordinates.coords.longitude,
          },
          zoom: 8,
        },
      });
      // this.newMap.enableCurrentLocation(true);
      // this.newMap.enableTrafficLayer(true)
      // Add a marker to the map
      const markerId = this.newMap.addMarker({
        coordinate: {
          lat:coordinates.coords.latitude,
          lng:coordinates.coords.longitude,
        }
      });
    }

  }

  //----------------------------------------------------------------------//

  //----------------------------Haptics----------------------------------//

  hapticsImpactMedium = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  hapticsImpactLight = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  hapticsVibrate = async () => {
    await Haptics.vibrate({duration:500}).then(()=>{
      console.log("Finished vibrating");
    });
  };

  hapticsSelectionStart = async () => {
    await Haptics.selectionStart();
  };

  hapticsSelectionChanged = async () => {
    await Haptics.selectionChanged();
  };

  hapticsSelectionEnd = async () => {
    await Haptics.selectionEnd();
  };

  hapticsNotification = async () =>{
    await Haptics.notification({type:NotificationType.Warning});
  };
//-------------------------------------------------------------------//


//--------------------------HTTP-------------------------------------//

  doGet = async () => {
    const options = {
      url: 'http://localhost:4200/tabs/tab1',
      headers: { 'X-Fake-Header': 'Fake-Value' },
      params: { size: 'XL' },
    };

    const response: HttpResponse = await CapacitorHttp.get(options);

    // or...
    // const response = await CapacitorHttp.request({ ...options, method: 'GET' })
  };

  // Example of a POST request. Note: data
  // can be passed as a raw JS Object (must be JSON serializable)
  doPost = async () => {
    const options = {
      url: 'http://localhost:4200/tabs/tab1',
      headers: { 'X-Fake-Header': 'Fake-Value' },
      data: { foo: 'bar' },
    };

    const response: HttpResponse = await CapacitorHttp.post(options);

    // or...
    // const response = await CapacitorHttp.request({ ...options, method: 'POST' })
  };
  doPut = async () => {
    const options = {
      url: 'http://localhost:4200/tabs/tab1',
      headers: { 'X-Fake-Header': 'Fake-Value' },
      data: { foo: 'bar' },
    };

    const response: HttpResponse = await CapacitorHttp.put(options);

    // or...
    // const response = await CapacitorHttp.request({ ...options, method: 'POST' })
  };

  doDelete = async () => {
    const options = {
      url: 'http://localhost:4200/tabs/tab1',
      headers: { 'X-Fake-Header': 'Fake-Value' },
      data: { foo: 'bar' },
    };

    const response: HttpResponse = await CapacitorHttp.delete(options);

    // or...
    // const response = await CapacitorHttp.request({ ...options, method: 'POST' })
  };

  doPatch = async () => {
    const options = {
      url: 'http://localhost:4200/tabs/tab1',
      headers: { 'X-Fake-Header': 'Fake-Value' },
      data: { foo: 'bar' },
    };

    const response: HttpResponse = await CapacitorHttp.patch(options);

    // or...
    // const response = await CapacitorHttp.request({ ...options, method: 'POST' })
  };

  //--------------------------------------------------------------------------------//

  //-------------------------------Keyboard-----------------------------------------//

  keyboard(){
    if(Capacitor.isNativePlatform()){
      Keyboard.addListener('keyboardWillShow', info => {
        console.log('keyboard will show with height:', info.keyboardHeight);
      });

      Keyboard.addListener('keyboardDidShow', info => {
        console.log('keyboard did show with height:', info.keyboardHeight);
      });

      Keyboard.addListener('keyboardWillHide', () => {
        console.log('keyboard will hide');
      });

      Keyboard.addListener('keyboardDidHide', () => {
        console.log('keyboard did hide');
      });
    }
  }
  //--------------------------------------------------------------------------------//

  //---------------------------------Notification -----------------------------------//
  getPending(){
    console.log(LocalNotifications.getPending());
  }
  // schedule(...)
  // getPending()
  // registerActionTypes(...)
  // cancel(...)
  // areEnabled()
  // getDeliveredNotifications()
  // removeDeliveredNotifications(...)
  // removeAllDeliveredNotifications()
  // createChannel(...)
  // deleteChannel(...)
  // listChannels()
  // checkPermissions()
  // requestPermissions()
  // addListener('localNotificationReceived', ...)
  // addListener('localNotificationActionPerformed', ...)
  // removeAllListeners()

  //-------------------------------------------------------------------//


  //----------------------------Motion---------------------------------//

  accelHandler: PluginListenerHandle;

  async motionEvent(){
    try {
      await DeviceMotionEvent;
    } catch (e) {
      // Handle error
      return;
    }

    // Once the user approves, can start listening:
    this.accelHandler = await Motion.addListener('accel', event => {
      console.log('Device motion event:', event);
    });
  }


// Stop the acceleration listener
  stopAcceleration = () => {
    if (this.accelHandler) {
      this.accelHandler.remove();
    }
  };

  // Remove all listeners
  removeListeners = () => {
    Motion.removeAllListeners();
  };

  //---------------------------------------------------------------------//


  //------------------------------Network--------------------------------//
  logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    console.log('Network status:', status);
  };

  //---------------------------------------------------------------------//


  //-----------------------------preferences------------------------------//

  setName = async () => {
    await Preferences.set({
      key: 'name',
      value: 'Max',
    });
  };

  checkName = async () => {
    const { value } = await Preferences.get({ key: 'name' });
    console.log(`Hello ${value}!`);
  };

  removeName = async () => {
    await Preferences.remove({ key: 'name' });
  };

  // configure(...)
  // get(...)
  // set(...)
  // remove(...)
  // clear()
  // keys()
  // migrate()
  // removeOld()

  //-----------------------------------------------------------//


  //------------------------pushNotification-------------------//

  addListeners = async () => {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    console.log(isPushNotificationsAvailable);
    if (isPushNotificationsAvailable) {
      await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
      });

      await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });
    }
  };

  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  };

  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  };

  //--------------------------------------------------------------------------//

  //---------------------------------screen reader----------------------------//

  checkScreenReaderEnabled = async () => {
    const { value } = await ScreenReader.isEnabled();
    console.log('Voice over enabled? ' + value);
  };

  sayHello = async () => {
    await ScreenReader.speak({ value: 'Hello World!' });
  };

  //---------------------------------------------------------------------------//


  //-----------------------------Share-----------------------------------------//

  async share(){
    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'http://ionicframework.com/',
      dialogTitle: 'Share with buddies',
    });
  }

  //---------------------------------------------------------------------------//

  //-----------------------------splash----------------------------------------//

  async splashShow(){
    // Show the splash for an indefinite amount of time:
    await SplashScreen.show({
      autoHide: false,
      fadeInDuration:1000,
      showDuration:3000,
    });
  }

  async splashShowAutoHide(){
    // Show the splash for two seconds and then automatically hide it:
    await SplashScreen.show({
      showDuration: 2000,
      fadeOutDuration:1000,
      autoHide: true,
    });
  }

  async splashHide(){
    await SplashScreen.hide();
  }

  //------------------------------------------------------------------------------//


  //------------------------------StatusBar---------------------------------------//
  setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  setStatusBarStyleLight = async () => {
    await StatusBar.setStyle({ style: Style.Light });
  };

  hideStatusBar = async () => {
    await StatusBar.hide();
  };

  showStatusBar = async () => {
    await StatusBar.show();
  };
  //------------------------------------------------------------------------------//

  //-----------------------------Text Zoom----------------------------------------//

  getTextSize(){
    const size = TextZoom.get();
    console.log(size);
  }

  setTextSize(){
    const size = TextZoom.set({value:5.0});
    console.log(size);
  }

  //------------------------------------------------------------------------------//

  //-------------------------------Toast--------------------------------------------//
  showHelloToast = async () => {
    await Toast.show({
      text: 'Hello! Guys',
      position:'top',
      duration:'long'
    });
  };
  //--------------------------------------------------------------------------------//


  //-----------------------------Brightness-----------------------------------------//

  async setBrightness(){
    const halfBright = 0.5;
    await ScreenBrightness.setBrightness({brightness:halfBright });
  }

  async getBrightness(){
    const brightness = await ScreenBrightness.getBrightness();
    console.log(brightness);
  }

  //----------------------------------------------------------------------------------//
}
