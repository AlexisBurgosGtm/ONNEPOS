let controllerventa = {
 iniciarVistaVentas: async function(){
     
    let txtFecha = document.getElementById('txtFecha');txtFecha.value = funciones.getFecha();
    let txtEntregaFecha = document.getElementById('txtEntregaFecha');txtEntregaFecha.value = funciones.getFecha();

    // listener para el nit
    let txtNit = document.getElementById('txtNit');
    txtNit.addEventListener('keydown',(e)=>{
        if(e.code=='Enter'){
            controllerventa.fcnBuscarCliente('txtNit','txtNombre','txtDireccion');    
        }
        if(e.code=='NumpadEnter'){
            controllerventa.fcnBuscarCliente('txtNit','txtNombre','txtDireccion');    
        }
    });

    document.getElementById('btnBuscarCliente').addEventListener('click',()=>{
        //controllerventa.fcnBuscarCliente('txtNit','txtNombre','txtDireccion');    
    });

    document.getElementById('txtBusqueda').addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            controllerventa.fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda');
            $('#ModalBusqueda').modal('show');
        }
        if(e.code=='NumpadEnter'){
            controllerventa.fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda');
            $('#ModalBusqueda').modal('show');
        }
    });
    document.getElementById('btnBuscarProducto').addEventListener('click',()=>{
        controllerventa.fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda');
        $('#ModalBusqueda').modal('show');
    });

    let btnCobrar = document.getElementById('btnCobrar');
    btnCobrar.addEventListener('click',()=>{
       
        
        if(btnCobrar.innerText=='Terminar'){
            funciones.AvisoError('No puede finalizar un pedido sin productos')
        }else{
           if(txtNit.value==''){
               funciones.AvisoError('Especifique el cliente a quien se carga la venta');
           }else{
                switch (GlobalTipoCobro) {
                    case 'COBRO':
                        $('#ModalCobro').modal('show');
                        document.getElementById('txtPagadoEfectivo').value=GlobalTotalDocumento;
                        document.getElementById('txtTotalPagado').innerText=GlobalTotalDocumento;
                        document.getElementById('txtTotalAPagar').innerText=funciones.setMoneda(GlobalTotalDocumento,'Q ');

                        break;
                    case 'TERMINAR':
                        $('#ModalFinalizarPedido').modal('show');   
                        break;
            
                    default:
                        break;
                }                 
           }
       }
       
    });

    let cmbCoddoc = document.getElementById('cmbCoddoc');
    classTipoDocumentos.comboboxTipodoc('ENV','cmbCoddoc');
    cmbCoddoc.addEventListener('change',async ()=>{
       await classTipoDocumentos.fcnCorrelativoDocumento('ENV',cmbCoddoc.value,'txtCorrelativo');
    });

    let cmbVendedor = document.getElementById('cmbVendedor');

    let btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
    btnFinalizarPedido.addEventListener('click',async ()=>{
        controllerventa.fcnFinalizarPedido();
    });

    //BUSQUEDA CLIENTES
    let frmNuevoCliente = document.getElementById('formNuevoCliente');
    frmNuevoCliente.addEventListener('submit',(e)=>{
        e.preventDefault();
        funciones.Confirmacion('¿Está seguro que desea guardar este cliente?')
        .then((value)=>{
            if(value==true){
                controllerventa.fcnGuardarNuevoCliente(frmNuevoCliente);
            }
        })

    });

    let btnBusquedaClientes = document.getElementById('btnBusquedaClientes');
    btnBusquedaClientes.addEventListener('click',()=>{
        $('#ModalBusquedaCliente').modal('show');
    });
    
    let txtBusquedaCliente = document.getElementById('txtBusquedaCliente');
    txtBusquedaCliente.addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            controllerventa.fcnBusquedaCliente('txtBusquedaCliente','tblResultadoBusquedaCliente');
        }
        if(e.code=='NumpadEnter'){
            controllerventa.fcnBusquedaCliente('txtBusquedaCliente','tblResultadoBusquedaCliente');
        }
    });

    document.getElementById('btnBuscarCliente').addEventListener('click',()=>{
        controllerventa.fcnBusquedaCliente('txtBusquedaCliente','tblResultadoBusquedaCliente');
    });
    document.getElementById('btnNuevoCliente').addEventListener('click',()=>{
        //$('#ModalNuevoCliente').modal('show');
        if(txtNit.value!==''){
            controllerventa.fcnBuscarCliente('txtNit','txtNombre','txtDireccion');
        }else{
            funciones.AvisoError('Escriba el NIT o código de cliente para comprobar');
        };
        
    })

     
    // EVENTOS DE LOS BOTONES
    document.body.addEventListener('keyup',(e)=>{
        if(GlobalSelectedForm=='VENTAS'){
            switch (e.keyCode) {
                case 118: //f7
                    btnCobrar.click();
                    break;
                case 113: //f2
                    btnBusquedaClientes.click();
                    //createNotification('hola mundo');
                default:
                    break;
            }    
        }
    });

    // carga el grid
   
    
    classTipoDocumentos.comboboxTipodoc('ENV','cmbCoddoc')
        .then(async()=>{
            await classTipoDocumentos.fcnCorrelativoDocumento('ENV',cmbCoddoc.value,'txtCorrelativo');
        })
        .then(async()=>{
            await controllerventa.fcnCargarGridTempVentas('tblGridTempVentas');
            await controllerventa.fcnCargarTotal('txtTotalVenta','txtTotalVentaCobro');
        })
    
    await controllerventa.fcnGetMunicipios('cmbClienteMunicipio');
    await controllerventa.fcnGetDepartamentos('cmbClienteDepartamento');
    await classEmpleados.comboboxVendedores('cmbVendedor');

    controllerventa.fcnCargarComboTipoPrecio();

    let txtPagadoEfectivo = document.getElementById('txtPagadoEfectivo');
    let txtVuelto = document.getElementById('txtVuelto');
    txtPagadoEfectivo.addEventListener('keyup',(e)=>{
        let txtTotalPagado = document.getElementById('txtTotalPagado');
        txtTotalPagado.innerText = funciones.setMoneda(txtPagadoEfectivo.value,'Q ');
        let vuelto = Number(txtPagadoEfectivo.value) - Number(GlobalTotalDocumento);
        txtVuelto.innerText = funciones.setMoneda(vuelto,'Q ');
    });

    
    let btnCobrarVenta = document.getElementById('btnCobrarVenta');
    btnCobrarVenta.addEventListener('click',async ()=>{
        
        controllerventa.fcnFinalizarPedido();
      
    });


   
},
fcnBusquedaProducto: async function(idFiltro,idTablaResultado){
    
    let filtro = document.getElementById(idFiltro).value;
    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;


    let str = ""; 
    axios.get('/ventas/buscarproducto?empnit=' + GlobalEmpnit + '&filtro=' + filtro + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;        
        data.recordset.map((rows)=>{
            let totalexento = 0;
            if (rows.EXENTO==1){totalexento=Number(rows.PRECIO)}
            str += `<tr id="${rows.CODPROD}">
            <td>
                ${funciones.quitarCaracteres(rows.DESPROD,'"'," pulg",true)}
                <br>
                <small class="text-danger"><b>${rows.CODPROD}</b></small>
            </td>
            <td>${rows.CODMEDIDA}<br>
                <small>${rows.EQUIVALE} item</small></td>
            <td>${funciones.setMoneda(rows.PRECIO || 0,'Q ')}</td>
            <td>${rows.DESMARCA}</td>
            <td>
                <button class="btn btn-sm btn-success btn-circle text-white" 
                onclick="controllerventa.fcnAgregarProductoVenta('${rows.CODPROD}','${funciones.quitarCaracteres(rows.DESPROD,'"'," plg",true)}','${rows.CODMEDIDA}',1,${rows.EQUIVALE},${rows.EQUIVALE},${rows.COSTO},${rows.PRECIO},${totalexento});">
                    +
                </button>
            <td>
        </tr>`
        })
        tabla.innerHTML= str;
        
    }, (error) => {
        console.log(error);
    });

},
fcnAgregarProductoVenta: async function(codprod,desprod,codmedida,cantidad,equivale,totalunidades,costo,precio,exento){
    document.getElementById('tblResultadoBusqueda').innerHTML = '';
        let coddoc = document.getElementById('cmbCoddoc').value;
        try {        
            
                var data =JSON.stringify({
                    empnit:GlobalEmpnit,
                    token:GlobalToken,
                    coddoc:coddoc,
                    codprod:codprod,
                    desprod:desprod,
                    codmedida:codmedida,
                    cantidad:cantidad,
                    equivale:equivale,
                    totalunidades:totalunidades,
                    costo:costo,
                    precio:precio,
                    totalcosto:costo,
                    totalprecio:precio,
                    exento:exento,
                    usuario:GlobalUsuario,
                    app:GlobalSistema
                });

                var peticion = new Request('/ventas/tempventas', {
                    method: 'POST',
                    headers: new Headers({
                       'Content-Type': 'application/json'
                    }),
                    body: data
                  });
            
                  await fetch(peticion)
                  
                  .then(async function(res) {
                    console.log('Estado: ', res.status);
                    if (res.status==200)
                    {
                        //socket.emit('productos nuevo', document.getElementById('desprod').value || 'sn');
                        $('#ModalBusqueda').modal('hide')
                        await controllerventa.fcnCargarGridTempVentas('tblGridTempVentas');
                        await controllerventa.fcnCargarTotal('txtTotalVenta','txtTotalVentaCobro');

                        let txbusqueda = document.getElementById('txtBusqueda');
                        txbusqueda.value = '';txbusqueda.focus();
                    }
                  })
                  .catch(
                      ()=>{
                        funciones.AvisoError('No se pudo agregar este producto a la venta actual');
                      }
                  )
        
                } catch (error) {
          
                }
                

},
fcnBuscarCliente: async(idNit,idNombre,idDireccion)=>{
    
    let nit = document.getElementById(idNit);
    let nombre = document.getElementById(idNombre);
    let direccion = document.getElementById(idDireccion);

    axios.get('/ventas/buscarcliente?empnit=' + GlobalEmpnit + '&nit=' + nit.value  + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;
        
        if (data.rowsAffected[0]==0){
            funciones.GetDataNit(idNit,txtClienteNombre,txtClienteDireccion)
            //funciones.GetDataNit(idNit,idNombre,idDireccion)
            .then((json)=>{
                console.log('resulta de json: ' + json);
                if(json.resultado==true){
                    document.getElementById('txtClienteNit').value = nit.value;
                    document.getElementById('txtClienteNombre').value = json.descripcion;
                    document.getElementById('txtClienteDireccion').value = json.direcciones.direccion;

                    document.getElementById('txtNombre').value = json.descripcion;
                    document.getElementById('txtDireccion').value = json.direcciones.direccion;

                    $('#ModalNuevoCliente').modal('show');
                }else{
                    document.getElementById('txtClienteNit').value = nit.value;
                    document.getElementById('txtNombre').value = '';
                    document.getElementById('txtDireccion').value = '';
                    $('#ModalNuevoCliente').modal('show');
                };

            })
            .catch(()=>{
                $('#ModalNuevoCliente').modal('show');
                document.getElementById('txtClienteNit').value = nit.value;
                document.getElementById('txtNombre').value = '';
                document.getElementById('txtDireccion').value = '';

                document.getElementById('txtClienteNombre').focus();
            })
        }else{
            data.recordset.map((rows)=>{
                nombre.value = rows.NOMCLIENTE;
                direccion.value = rows.DIRCLIENTE;
            })
        }
                
    }, (error) => {
        console.log(error);
    });
},
fcnBusquedaCliente: async function(idFiltro,idTablaResultado){
    
    let filtro = document.getElementById(idFiltro).value;
    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;


    let str = ""; 
    axios.get('/clientes/buscarcliente?empnit=' + GlobalEmpnit + '&filtro=' + filtro + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;        
        data.recordset.map((rows)=>{
            str += `<tr id="${rows.CODCLIE}">
                        <td>
                            ${rows.NOMCLIE}
                            <br>
                            <small>Código: ${rows.CODCLIE} / Nit: ${rows.NIT}</small>
                        </td>
                        <td>${rows.DIRCLIE}</td>
                        <td>
                            ${rows.DESMUNICIPIO}
                            <br>
                            <small>${rows.DESDEPTO}</small>
                        </td>
                        <td>${funciones.setMoneda(rows.SALDO,'Q')}</td>
                        <td>
                            <button class="btn btn-sm btn-success btn-circle text-white" 
                            onclick="controllerventa.fcnAgregarClienteVenta('${rows.CODCLIE}','${rows.NIT}','${rows.NOMCLIE}','${rows.DIRCLIE}')">
                                +
                            </button>
                        <td>
                    </tr>`
        })
        tabla.innerHTML= str;
        
    }, (error) => {
        console.log(error);
    });

},
fcnAgregarClienteVenta: async function(codigo,nit,nombre,direccion){
    document.getElementById('tblResultadoBusquedaCliente').innerHTML = '';
    document.getElementById('txtNit').value = nit;
    document.getElementById('txtNombre').value = nombre;
    document.getElementById('txtDireccion').value = direccion;
    $('#ModalBusquedaCliente').modal('hide');  
},
fcnGuardarNuevoCliente: async (form)=>{
    
    let nit = form[0].value;
    let nomclie = form[1].value;
    let nomfac = form[2].value;
    let dirclie = form[3].value;
    let codpais = form[4].value;
    let telclie = form[5].value;
    let emailclie = form[6].value;
    let codmunicipio = form[7].value;
    let coddepto = form[8].value;
    let tipoprecio = form[9].value;

    let codven = document.getElementById('cmbVendedor').value;

    // OBTIENE LA LATITUD Y LONGITUD DEL CLIENTE
    let lat = ''; let long = '';
    try {navigator.geolocation.getCurrentPosition(function (location) {lat = location.coords.latitude.toString();long = location.coords.longitude.toString(); })
    } catch (error) {lat = '0'; long = '0'; };
    
    // FECHA DE CREACION DEL CLIENTE
    let f = funciones.getFecha();

    axios.post('/clientes/clientenuevo', {
        app:GlobalSistema,
        empnit: GlobalEmpnit,
        codclie:nit,
        nitclie:nit,
        nomclie:nomclie,
        nomfac:nomfac,
        dirclie:dirclie,
        coddepto:coddepto,
        codmunicipio:codmunicipio,
        codpais:codpais,
        telclie:telclie,
        emailclie:emailclie,
        codbodega:GlobalCodBodega,
        tipoprecio:tipoprecio,
        lat:lat,
        long:long,
        codven:codven,
        fecha:f        
    })
    .then((response) => {
        const data = response.data;
        if (data.rowsAffected[0]==0){
            funciones.AvisoError('No se logró Guardar el nuevo cliente');
        }else{
            funciones.Aviso('Nuevo Cliente Agregado Exitosamente !!')
            document.getElementById('txtNit').value = nit;
            document.getElementById('txtNombre').value = nomclie;
            document.getElementById('txtDireccion').value = dirclie;
            document.getElementById('btnCancelarCliente').click();
        }
    }, (error) => {
        funciones.AvisoError('No se logró Guardar el nuevo cliente');
        console.log(error);
    });


},
fcnEliminarItem: async function(id){
    
    try {        
            var data =JSON.stringify({
                id:id
            });

            var peticion = new Request('/ventas/tempventas', {
                method: 'DELETE',
                headers: new Headers({
                   'Content-Type': 'application/json'
                }),
                body: data
              });
        
              await fetch(peticion)
              
              .then(async function(res) {
                console.log('Estado: ', res.status);
                if (res.status==200)
                {
                    console.log(id.toString());
                    document.getElementById(id.toString()).remove();
                    //await fcnCargarGridTempVentas('tblGridTempVentas');
                    await controllerventa.fcnCargarTotal('txtTotalVenta','txtTotalVentaCobro');
                }
              })
              .catch(
                  ()=>{
                    funciones.AvisoError('No se pudo remover este producto a la venta actual');
                  }
              )
    
        } catch (error) {

        }
},
fcnCargarGridTempVentas: async function(idContenedor){
    let tabla = document.getElementById(idContenedor);

    tabla.innerHTML = GlobalLoader;
    let coddoc = document.getElementById('cmbCoddoc').value;
    
    try {
        
        const response = await fetch('/ventas/tempventas?empnit=' + GlobalEmpnit + '&coddoc=' + coddoc + '&usuario=' + GlobalUsuario +  '&app=' + GlobalSistema)
        const json = await response.json();
        let idcant = 0;
        let data = json.recordset.map((rows)=>{
            idcant = idcant + 1;
            return `<tr id="${rows.ID.toString()}">
                        <td class="text-left">
                            ${rows.DESPROD}
                            <br>
                            <small class="text-danger"><b>${rows.CODPROD}</b></small>
                        </td>
                        <td class="text-right">${rows.CODMEDIDA}<br>
                            <small>${rows.EQUIVALE} item</small></td>
                        <td class="text-center">
                            <button class="btn btn-outline-secondary btn-xs btn-icon rounded-circle" onClick="controllerventa.fcnDisminuirCantidad(${idcant},'${'S'+idcant}',${rows.PRECIO},${rows.ID});">-</button>
                            <b class="text-danger h4" id=${idcant}>${rows.CANTIDAD}</b>
                            <button class="btn btn-outline-info btn-xs btn-icon rounded-circle" onClick="controllerventa.fcnAumentarCantidad(${idcant},'${'S'+idcant}',${rows.PRECIO},${rows.ID});">+</button>
                        </td>
                        <td class="text-right">${funciones.setMoneda(rows.PRECIO,'Q')}</td>
                        <td class="text-right" id=${'S'+idcant}>${funciones.setMoneda(rows.PRECIO,'Q')}</td>
                        <td>
                            <button class="btn btn-sm btn-danger btn-circle text-white" onclick="controllerventa.fcnEliminarItem(${rows.ID});">
                                x
                            </button>
                        <td>
                    </tr>`
       }).join('\n');
       
       tabla.innerHTML = data;
      
    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA ' + error);

    }
},
fcnAumentarCantidad: function (idCantidad, idSubtotal, precio,id){
    let cantidad = document.getElementById(idCantidad);
    let cant = document.getElementById(idCantidad).innerText;
    
        let n = Number(cant) + 1;cantidad.innerText = n;
        document.getElementById(idSubtotal).innerText = funciones.setMoneda(n * Number(precio),'Q');

        controllerventa.fcnUpdateTempRow(id,n);
    
},
fcnDisminuirCantidad: function (idCantidad, idSubtotal, precio,id){
    let cantidad = document.getElementById(idCantidad);
    let cant = document.getElementById(idCantidad).innerText;
    
        let n = Number(cant) - 1; cantidad.innerText = n;
        document.getElementById(idSubtotal).innerText = funciones.setMoneda(n * Number(precio),'Q');
        controllerventa.fcnUpdateTempRow(id,n);
},
fcnCargarTotal: async function (idContenedor,idContenedor2){
    let container = document.getElementById(idContenedor);
    let container2 = document.getElementById(idContenedor2);
    
    let btnCobrarTotal = document.getElementById('btnCobrar')
    //btnCobrarTotal.innerText =  'Cobrar : Q 0.00'
    btnCobrarTotal.innerText =  'Terminar'

    container.innerHTML = '0'
    container2.innerHTML = '0'

    try {
        
        const response = await fetch('/ventas/tempventastotal?empnit=' + GlobalEmpnit + '&usuario=' + GlobalUsuario  + '&app=' + GlobalSistema)
        const json = await response.json();
       
        let data = json.recordset.map((rows)=>{
            GlobalTotalDocumento = Number(rows.TOTALPRECIO);
            GlobalTotalCostoDocumento = Number(rows.TOTALCOSTO);
            return `${funciones.setMoneda(rows.TOTALPRECIO,'Q ')}`
       }).join('\n');
       
       container.innerText = data;
       container2.innerText = data;
       btnCobrarTotal.innerHTML = '<h1>Terminar : ' + data + '</h1>';
       //btnCobrarTotal.innerHTML = '<h1>Cobrar : ' + data + '</h1>';
    } catch (error) {
        //console.log('NO SE LOGRO CARGAR LA LISTA ' + error);

    }

    if(container.innerHTML=='0'){
    }else{
        socket.emit('ordenes escribiendo', 'Se está generando una nueva orden',GlobalSelectedForm)
    }
},
fcnFinalizarPedido: async()=>{
    
    let codcliente = GlobalSelectedCodcliente;
    let ClienteNombre = document.getElementById('txtNombre').value;
    let dirclie = document.getElementById('txtDireccion').value; // CAMPO DIR_ENTREGA
    let obs = document.getElementById('txtEntregaObs').value; 
    let direntrega = document.getElementById('txtEntregaDireccion').value; //CAMPO MATSOLI
    let codbodega = GlobalCodBodega;
    let cmbTipoEntrega = document.getElementById('cmbEntregaTipo').value; //campo TRANSPORTE



    let txtFecha = new Date(document.getElementById('txtFecha').value);
    let anio = txtFecha.getFullYear();
    let mes = txtFecha.getUTCMonth()+1;
    let d = txtFecha.getUTCDate() 
    let fecha = anio + '-' + mes + '-' + d; // CAMPO DOC_FECHA
    let dia = d;

    let fe = new Date(document.getElementById('txtEntregaFecha').value);
    let ae = fe.getFullYear();
    let me = fe.getUTCMonth()+1;
    let de = fe.getUTCDate() 
    let fechaentrega = ae + '-' + me + '-' + de;  // CAMPO DOC_FECHAENT

    let coddoc = document.getElementById('cmbCoddoc').value;//GlobalCoddoc;
    let correlativo = document.getElementById('txtCorrelativo').value;

    let cmbVendedor = document.getElementById('cmbVendedor');

    let nit = document.getElementById('txtNit').value;

    funciones.Confirmacion('¿Está seguro que desea Finalizar este Pedido')
    .then((value)=>{
        if(value==true){

            //,,obs,usuario,codven
            axios.post('/ventas/documentos', {
                app: GlobalSistema,
                empnit: GlobalEmpnit,
                coddoc:coddoc,
                correlativo: correlativo,
                anio:anio,
                mes:mes,
                dia:dia,
                fecha:fecha,
                fechaentrega:fechaentrega,
                formaentrega:cmbTipoEntrega,
                codbodega:codbodega,
                codcliente: codcliente,
                nomclie:ClienteNombre,
                totalcosto:GlobalTotalCostoDocumento,
                totalprecio:GlobalTotalDocumento,
                nitclie:nit,
                dirclie:dirclie,
                obs:obs,
                direntrega:direntrega,
                usuario:GlobalUsuario,
                codven:cmbVendedor.value
            })
            .then(async(response) => {
                const data = response.data;
                if (data.rowsAffected[0]==0){
                    funciones.AvisoError('No se logró Guardar este pedido');
                }else{

                    funciones.Aviso('Pedido Generado Exitosamente !!!')
                    document.getElementById('btnEntregaCancelar').click();
                    $('#ModalCobro').modal('hide');
        
                    socket.emit('ordenes nueva',`Nueva Orden a nombre de ${ClienteNombre} por valor de ${GlobalTotalDocumento} quetzales`, GlobalSelectedForm);
                    controllerventa.fcnEliminarTempVentas(GlobalUsuario);
                    controllerventa.fcnNuevoPedido();
                }
            }, (error) => {
                console.log(error);
            });           
            
        }
    })
},
fcnEliminarTempVentas: async(usuario)=>{
    let coddoc = document.getElementById('cmbCoddoc').value;
    axios.post('/ventas/tempVentastodos', {
        empnit: GlobalEmpnit,
        usuario:usuario,
        coddoc:coddoc,
        app:GlobalSistema
    })
    .then((response) => {
        const data = response.data;
        if (data.rowsAffected[0]==0){
            funciones.AvisoError('No se logró Eliminar la lista de productos agregados');
        }else{
            
        }
    }, (error) => {
        console.log(error);
    });
},
fcnNuevoPedido:async()=>{
    
    document.getElementById('txtNit').value ='CF';
    document.getElementById('txtNombre').value = 'CONSUMIDOR FINAL';
    document.getElementById('txtDireccion').value = 'CIUDAD';
    document.getElementById('txtEntregaObs').value = 'SN';
    document.getElementById('txtEntregaDireccion').value = 'SN';

    await classTipoDocumentos.fcnCorrelativoDocumento('ENV',cmbCoddoc.value,'txtCorrelativo');
    await controllerventa.fcnCargarTotal('txtTotalVenta','txtTotalVentaCobro');
    await controllerventa.fcnCargarGridTempVentas('tblGridTempVentas');

},
fcnUpdateTempRow: async(id,cantidad)=>{
    
    let costo = 0; let precio = 0; let equivale = 0; let exento = 0;
    
    axios.post('/ventas/tempVentasRow', {
        id:id,
        app: GlobalSistema
    })
    .then((response) => {
        const data = response.data;
        
        data.recordset.map((rows)=>{
            costo = rows.COSTO;
            precio = rows.PRECIO;
            equivale = rows.EQUIVALE;
            exento = rows.EXENTO;
        })
        let totalcosto = Number(costo) * Number(cantidad);
        let totalprecio = Number(precio) * Number(cantidad);
        let totalexento = Number(exento) * Number(cantidad);
        let totalunidades = Number(equivale) * Number(cantidad);
            axios.put('/ventas/tempVentasRow', {
                app: GlobalSistema,
                id:id,
                totalcosto:totalcosto,
                totalprecio:totalprecio,
                cantidad:cantidad,
                totalunidades: totalunidades,
                exento:totalexento
            })
            .then(async(re) => {
                const data2 = re.data;
                if (data2.rowsAffected[0]==0){
                    funciones.AvisoError('No se logró Eliminar la lista de productos agregados');
                }else{
                    await controllerventa.fcnCargarTotal('txtTotalVenta','txtTotalVentaCobro');
                    console.log('Row actualizada exitosamente')
                }
            }, (error) => {
                console.log(error);
            });  
    }, (error) => {
        console.log(error);
    });  

    
},
fcnGetMunicipios: async(idContainer)=>{
    let container = document.getElementById(idContainer);
    container.innerHTML = GlobalLoader;

    let str = ""; 
    axios.get('/clientes/municipios?empnit=' + GlobalEmpnit + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;        
        data.recordset.map((rows)=>{
            str += `<option value='${rows.CODMUNICIPIO}'>${rows.DESMUNICIPIO}</option>`
        })
        container.innerHTML= str;
        
    }, (error) => {
        console.log(error);
        container.innerHTML = '';
    });
},
fcnGetDepartamentos: async(idContainer)=>{
    let container = document.getElementById(idContainer);
    container.innerHTML = GlobalLoader;

    let str = ""; 
    axios.get('/clientes/departamentos?empnit=' + GlobalEmpnit + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;        
        data.recordset.map((rows)=>{
            str += `<option value='${rows.CODDEPTO}'>${rows.DESDEPTO}</option>`
        })
        container.innerHTML= str;
        
    }, (error) => {
        console.log(error);
        container.innerHTML = '';
    });
},
fcnCargarComboTipoPrecio: ()=>{
   let cmbp = document.getElementById('cmbClienteTipoPrecio');
   if(GlobalSistema=='ISC'){
    cmbp.innerHTML =`<option value="P">PÚBLICO</option>
                     <option value="M">MAYORISTA</option>`;
   }else{
    cmbp.innerHTML =`<option value="P">PÚBLICO</option>
                     <option value="C">MAYORISTA C</option>
                     <option value="B">MAYORISTA B</option>
                     <option value="A">MAYORISTA A</option>`;
   }
   
}
}