let controllerdespacho = {
    iniciarVistaDespacho: async ()=>{
        
        await controllerdespacho.getListadoOrdenes('tblOrdenes');

    },
    getListadoOrdenes: async (idContainer)=>{
        
        let container = document.getElementById(idContainer);
        let str = '';
        let id = 0;
        container.innerHTML = GlobalLoader;

        axios.get('/ventas/pedidospendientes?empnit=' + GlobalEmpnit + '&app=' + GlobalSistema)
        .then((response) => {
        const data = response.data;       
        data.recordset.map((rows)=>{
            id = id + 1;
            str = str + `<tr id=${id}>
                            <td>${rows.FECHA.replace('T00:00:00.000Z','')}</td>
                            <td>${rows.CODDOC} - ${rows.CORRELATIVO}</td>
                            <td>${rows.NOMCLIE}
                                <br>
                                    <small><b class="text-danger">Entregar:</b>${rows.DIRENTREGA}</small>
                                <br>
                                    <small><b class="text-danger">Obs:</b>${rows.OBS}</small>
                            </td>
                            <td>${funciones.setMoneda(rows.IMPORTE,'Q')}</td>
                            <td>
                                <button class="btn btn-warning btn-sm btn-circle" onClick="controllerdespacho.fcnDetallePedido('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.NOMCLIE}',${rows.IMPORTE},${id});">
                                    +
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm btn-circle" onClick="controllerdespacho.fcnDespachado('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.NOMCLIE}', '${rows.IMPORTE}',${id})">
                                    +
                                </button>
                            </td>
                        </tr>`        
        })
        
        container.innerHTML = str;
                
        }, (error) => {
            console.log(error);
        });
    },
    fcnDespachado: (coddoc,correlativo,cliente,monto,id)=>{
        
        document.getElementById(id).className = "bg-warning";

        funciones.Confirmacion('¿Este pedido ya se ha despachado?')
        .then((value)=>{
            if(value==true){
                axios.post('/ventas/pedidodespachado', {
                    empnit: GlobalEmpnit,
                    coddoc:coddoc,
                    correlativo: correlativo,
                    app: GlobalSistema
                })
                .then((response) => {
                    const data = response.data;
                    if (data.rowsAffected[0]==0){
                        funciones.AvisoError('No se logró finalizar este pedido');
                        document.getElementById(id).className = "";
                    }else{
                        funciones.Aviso('Pedido finalizado exitosamente !!!')
                        socket.emit('ordenes finalizada', cliente,monto);
                        document.getElementById(id).remove();
                        
                    }            
                }, (error) => {
                    console.log(error);
                });
            }else{
                document.getElementById(id).className = "";
            }
        })
    },
    fcnDetallePedido: (coddoc,correlativo,cliente,importe,id)=>{
        document.getElementById(id).className = "bg-warning";
        
        $("#ModalDetallePedido").modal('show');
        document.getElementById('txtCliente').innerText = cliente;
        document.getElementById('txtDocumento').innerText = coddoc + '-' + correlativo;
        document.getElementById('txtTotalDocumento').innerText = funciones.setMoneda(importe,'Q ');
        
        let container = document.getElementById('tblPedidoSeleccionado');
        container.innerHTML = GlobalLoader;

        let str = '';
        let idrow = 0;

        axios.post('/ventas/pedidodetalle', {
            empnit: GlobalEmpnit,
            coddoc:coddoc,
            correlativo: correlativo,
            app: GlobalSistema
        })
        .then((response) => {
            const data = response.data;
            data.recordset.map((rows)=>{
                idrow = idrow + 1000;
                str = str + `<tr id=${idrow}>
                                <td>${rows.DESPROD}
                                    <br>
                                    <small class="text-danger">${rows.CODPROD}</small>
                                </td>
                                <td>${rows.CODMEDIDA}</td>
                                <td><h1>${rows.CANTIDAD}</h1></td>
                                <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                                <td>
                                    <button class="btn btn-circle btn-success" onClick="controllerdespacho.fcnCheckItemPedido(${idrow});">
                                        <i class="fal fa-check mr-1"></i>
                                    </button>
                                </td>
                            </tr>`
            })
            container.innerHTML = str;                          
            
            let btnContainer = document.getElementById('btnAceptarContainer');
            btnContainer.innerHTML = '';
            btnContainer.innerHTML = `<button class="btn btn-success btn-lg btn-pills btn-block waves-effect waves-themed"  data-dismiss="modal" 
            onClick="controllerdespacho.fcnDespachado('${coddoc}','${correlativo}','${cliente}', '${importe}',${id})">
                                        <i class="fal fa-check mr-1"></i>
                                        Finalizado !!
                                      </button>`
            let btnCancelarContainer = document.getElementById('btnCancelarContainer');
            btnCancelarContainer.innerHTML = '';
            btnCancelarContainer.innerHTML = `<button class="btn btn-secondary btn-lg btn-pills btn-block waves-effect waves-themed" data-dismiss="modal" 
            onClick='document.getElementById("${id}").className = "";'>
                                                << Regresar
                                             </button>`
        }, (error) => {
            console.log(error);
            container.innerHTML = 'No se pudieron obtener los datos del pedido';
        });


    },
    fcnCheckItemPedido: (idrow)=>{
        let row = document.getElementById(idrow);
        if(row.className == "bg-warning"){
            row.className = "";
        }else{
            row.className = "bg-warning";
        }
    }


}