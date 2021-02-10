socket.on('ordenes nueva', function(msg,form){
    try {
      if(GlobalSelectedForm=='DESPACHO'){
        
        funciones.NotificacionPersistent(msg ,form);
        let notif = document.getElementById('txtNotif');
        notif.innerHTML = `<div class="bg-danger text-white">${msg}</div>`;
        funciones.hablar(msg);

        //recarga la lista de pedidos pendientes en el despacho
        controllerdespacho.getListadoOrdenes('tblOrdenes');
        // hace desaparece la notificación en rojo 
        setInterval(() => {
          notif.innerHTML = '';
        }, 15000);
      }     
    } catch (error) {
    
    }
    //funciones.NotificacionPersistent(msg,"Nueva Orden generada");
});

socket.on('ordenes escribiendo', function(msg,form){
  try {
    if(GlobalSelectedForm=='DESPACHO'){
      let notif = document.getElementById('txtNotif');
      notif.innerHTML = `<div class="bg-warning text-white">Se está tomando una nueva orden en ventas</div>`;
    }     
  } catch (error) {
  
  }
  //funciones.NotificacionPersistent(msg,"Nueva Orden generada");
});

socket.on('ordenes finalizada', function(cliente,monto){
  try {
    if(GlobalSelectedForm=='CAJA'){
        funciones.NotificacionPersistent(`${cliente} por valor de ${funciones.setMoneda(monto)}`,"Orden Lista");
        funciones.hablar(`Orden a nombre de ${cliente} por valor de ${monto} quetzales se encuentra lista para su despacho`);
    }     
  } catch (error) {
  
  }
});