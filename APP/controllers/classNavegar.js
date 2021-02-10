let classNavegar = {
    login : async()=>{
        funciones.loadView('./DASHBOARD/views/login/viewLogin.html','root')
        .then(()=>{
          funciones.loadScript('./DASHBOARD/views/login/controller.js','root')
            .then(()=>{
                GlobalSelectedForm='LOGIN';
                InicializarLogin();
            })
        })
    },
    inicio : async()=>{
        funciones.loadView('../views/inicio/index.html','root')
        .then(()=>{
          funciones.loadScript('../views/inicio/controller.js','root')
            .then(()=>{
                GlobalSelectedForm='INICIO';
                InicializarVista();
            })
        })
    },
    ventas: async()=>{
        funciones.loadView('../views/facturacion/index.html','root')
        .then(()=>{
            funciones.loadScript('./models/classEmpleados.js','root')
            funciones.loadScript('./views/facturacion/controller.js','root')
            .then(()=>{
                GlobalSelectedForm ='VENTAS';
                controllerventa.iniciarVistaVentas();

            })
        })
    },
    despacho: async()=>{
        funciones.loadView('../views/despacho/index.html','root')
        .then(()=>{
            funciones.loadScript('./views/despacho/controller.js','root')
            .then(()=>{
                GlobalSelectedForm ='DESPACHO';
                controllerdespacho.iniciarVistaDespacho();
            })
        })
    },
    caja: async()=>{
        funciones.loadView('../views/caja/index.html','root')
        .then(()=>{
            funciones.loadScript('./views/caja/controller.js','root')
            .then(()=>{
                GlobalSelectedForm ='CAJA';
                controllercaja.iniciarVistaCaja();
            })
        })
    }

}