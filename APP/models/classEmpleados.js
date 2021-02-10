let classEmpleados = {
    comboboxVendedores : async(idContainer)=>{
        let combobox = document.getElementById(idContainer);
        
        let str = ""; 
        axios.get('/empleados/vendedores?empnit=' + GlobalEmpnit + '&app=' + GlobalSistema)
        .then((response) => {
            const data = response.data;        
            data.recordset.map((rows)=>{
                str += `<option value="${rows.CODVEN}">${rows.NOMVEN}</option>`
            })            
            combobox.innerHTML = str;
            
        }, (error) => {
            //str = ''
        });
        
    }

}