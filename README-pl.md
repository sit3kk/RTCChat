
# Komunikator RTC

Prosty projekt komunikatora do przesyłania wiadomości, rozmów głosowych i wideo.
Aplikacja działa na urządzeniach mobilnych z systemem iOS lub Android. Stworzona w  React Native, korzysta z technologii AgoraSDK do prowadzenia rozmów, a dane użytkowników oraz wiadomości tekstowe przesyłane są za pośrednictwem platformy Firebase. Do rejestracji/logowania zastosowana została autentykacja Google OAuth2.


Aplikacja stworzona w ramach projektu do kursu "Zaawansowanych Wzorców Projektowych" oferowanego na UJ.


# Funkcje

- autentykacja  Google OAuth2
- dodawanie znajomych za pomocą kodu z zaproszeniem
- czat wiadomości tekstowych
- rozmowy głosowe i wideo w czasie rzeczywistym
- przesyłanie zdjęć w czacie
- informacja o nieodczytanych wiadomościach
- aplikacja wieloplatformowa (iOS/Android)
- nowoczene i dopracowane UI


## Instalacja

Wymagane jest posiadanie środowiska Node.js (np. v20.15.1). Do uruchomienia aplikacji na symulatorze/urządzeniu iOS potrzebne jest środowisko `Xcode` a dla Androida `Android Studio`. Najlepiej podążać za [dokumentacją przygotowania środowiska do pracy z React Native](https://reactnative.dev/docs/set-up-your-environment
). 

Do autentykacji Google OAuth2 potrzebne jest dostarczenie do konfiguracji AuthRequestConfig iosClientId oraz androidClientId, które są wczytywane z pliku `.env`, który należy stworzyć i umieścic w folderze `app`:

```bash
REACT_APP_IOS_CLIENT_ID=
REACT_APP_ANDROID_CLIENT_ID=
```

### Instalacja natywna i uruchamianie aplikacji:

```bash
  cd app
  npm install
  npm run start
```

Przy uruchamianiu aplikacji na symulatorze iOS należy wykonać dodatkowo:

```bash
  cd ios
  pod install
```
Poza powyższym, w przypadku uruchomienia aplikacji na urządzeniu iOS:
```bash
  open app.xcworkspace
```
Następnie w `Xcode` należy zbudować i zainstalować aplikację na wybranym urządzeniu. Pomocna dokumentacja:
  https://developer.apple.com/documentation/xcode/building-and-running-an-app
https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device

Po zainstalowaniu aplikacji na urządzeniu skanujemy kod QR stworzony przez server Expo.

  
## Zrzuty ekranu

<img src="https://github.com/user-attachments/assets/534d2939-c3ac-434f-beeb-25a86b3d7798" alt="Screenshot 1" width="220" />
<img src="https://github.com/user-attachments/assets/a8c84a84-1a8f-455a-877e-ace7bdbc16ae" alt="Screenshot 2" width="220" />
<img src="https://github.com/user-attachments/assets/9e4e2f13-475b-4796-a081-cb5590f6831d" alt="Screenshot 3" width="220" />
<img src="https://github.com/user-attachments/assets/c176cae8-f5b8-4143-b3f4-9b5995f515d0" alt="Screenshot 4" width="220" />

