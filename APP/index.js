var socket = io();

//inicializa la instalacion de la app
funciones.instalationHandlers('btnInstalarApp');

function InicializarServiceWorkerNotif(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
   navigator.serviceWorker.register('./sw.js')
    .then(registration => console.log('Service Worker registered'))
    .catch(err => 'SW registration failed'));
  };

  requestPermission();
}

if ('Notification' in window) {};

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    //$status.innerText = result;
  });
}

InicializarServiceWorkerNotif();

// LISTENER DE LOS BOTONES DEL MENU
let btnMenuSalir = document.getElementById('btnMenuSalir');
btnMenuSalir.addEventListener('click',()=>{
    classNavegar.inicio();
});


classNavegar.inicio();

function createNotification(text) {
  // eslint-disable-next-line no-undef
  new Noty({
    type: 'info',
    layout: 'topRight',
    timeout: '2000',
    theme: 'metroui',
    progressBar: false,
    text,
  }).show();
}