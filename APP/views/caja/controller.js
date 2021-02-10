let controllercaja = {
    iniciarVistaCaja: ()=>{
        controllercaja.getPedidosPendientes();
    },
    getPedidosPendientes: ()=>{
        let container = document.getElementById('tblPedidos');
        container.innerHTML = GlobalLoader;
        let str = '';
        axios.post('/pedidos/pedidospendientes', {
            token: GlobalToken,
            empnit: GlobalEmpnit
        })
        .then((response) => {
            const data = response.data;
            data.recordset.map((rows)=>{
                str = str + controllercaja.rowPedidos(rows.FECHA,rows.CODDOC,rows.CORRELATIVO,rows.NOMVEN,rows.NOMCLIENTE,rows.OBS,rows.TOTALVENTA);                              
            })
            container.innerHTML = str;
        }, (error) => {
            console.log(error);
        });
    },
    rowPedidos: (fecha,coddoc,correlativo,vendedor,cliente,obs,importe)=>{
        return `<tr>
                    <td>${vendedor}</td>
                    <td>
                        ${coddoc}-${correlativo}
                        <br>
                        <small>${fecha.replace('T00:00:00.000Z','').toString()}</small>
                    </td>
                    <td>
                        ${cliente}
                        <br>
                        <small>${obs}</small>
                    </td>
                    <td>${funciones.setMoneda(importe,'Q')}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-circle">
                            <i class="fa fal-check"></i>
                        </button>
                    </td>
                </td>`
    }
}