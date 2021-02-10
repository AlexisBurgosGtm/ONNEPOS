function InicializarVista(){

    document.getElementById('txtNomEmpresa').innerText = GlobalEmpNombre;
    
    let btnInicioVentas = document.getElementById('btnInicioVentas');
    let btnInicioDespacho = document.getElementById('btnInicioDespacho');
    let btnInicioCaja =  document.getElementById('btnInicioCaja');
    let txtPass = document.getElementById('txtPass');
    

    btnInicioVentas.addEventListener('click',()=>{
        //classNavegar.ventas();    
        //return;

        $('#ModalLogin').modal('show');
        GlobalSelectedApp = 'VENTAS';
      
    });
    btnInicioDespacho.addEventListener('click',()=>{
        classNavegar.despacho();
        return;

        $('#ModalLogin').modal('show');
        GlobalSelectedApp = 'DESPACHO';
       
    });
    btnInicioCaja.addEventListener('click',()=>{
        $('#ModalLogin').modal('show');
        GlobalSelectedApp = 'CAJA';
      
    });

    let imgInicioVentas = document.getElementById('imgInicioVentas');
    let imgInicioDespacho = document.getElementById('imgInicioDespacho');
    let imgInicioCaja =  document.getElementById('imgInicioCaja');

    imgInicioVentas.addEventListener('click',()=>{
        //classNavegar.ventas();    
        //return;
        
        $('#ModalLogin').modal('show');
        GlobalSelectedApp = 'VENTAS';
      
    });
    imgInicioDespacho.addEventListener('click',()=>{
        classNavegar.despacho();
        return;

        $('#ModalLogin').modal('show');
        GlobalSelectedApp = 'DESPACHO';
        
    });
    imgInicioCaja.addEventListener('click',()=>{
        classNavegar.caja();
        return;
        
        $('#ModalLogin').modal('show');
        GlobalSelectedApp = 'CAJA';
      
    });


    let btnLogin = document.getElementById('btnLogin');
    btnLogin.addEventListener('click',async ()=>{
        await getLogin(txtPass.value,GlobalSelectedApp);
    });

    txtPass.addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            btnLogin.click();
        }
        if(e.code=='NumpadEnter'){
            btnLogin.click();
        }
    });

    classTipoDocumentos.getEmpresas('cmbEmpresas')

};


async function getLogin(pass,app){
    
    GlobalEmpnit = document.getElementById('cmbEmpresas').value;

    $('#ModalLogin').modal('hide');
    switch (app) {
        case 'VENTAS':
            
            classNavegar.ventas();    
            break;
        case 'DESPACHO':
            classNavegar.despacho();    
            break;
        case 'CAJA':
            classNavegar.caja();    
            break;
        default:
            classNavegar.inicio();
            break;
    }
    return;
    
    axios.post('/usuarios/login', {
        pass: pass,
        app: GlobalSistema
    })
    .then((response) => {
        const data = response.data;
        data.recordset.map((rows)=>{
            if(data.rowsAffected[0]==1){
                GlobalUsuario = rows.USUARIO;
                GlobalNivelUser = Number(rows.NIVEL);
                $('#ModalLogin').modal('hide');
                funciones.Aviso('Bienvenido/a ' + GlobalUsuario);
                switch (app) {
                    case 'VENTAS':
                        
                        classNavegar.ventas();    
                        break;
                    case 'DESPACHO':
                        classNavegar.despacho();    
                        break;
                    case 'CAJA':
                        classNavegar.caja();    
                        break;
                    default:
                        classNavegar.inicio();
                        break;
                }
                
            }else{
                funciones.AvisoError('Contraseña incorrecta')    
            }
        })
 
    }, (error) => {
        console.log(error);
    });

};
