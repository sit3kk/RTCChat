
# Komunikator WebRTC

Prosty projekt komunikatora do przesyłania wiadomości, rozmów głosowych i wideo.
Aplikacja działa na urządzeniach mobilnych z systemem iOS lub Android. Stworzona w  React Native, korzysta z technologii WebRTC do prowadzenia rozmów, a dane użytkowników oraz wiadomości tekstowe przesyłane są za pośrednictwem platformy Firebase. Do rejestracji/logowania zastosowana została autentykacja Google OAuth2.


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

  
## Screenshots

--


## Demo

--

