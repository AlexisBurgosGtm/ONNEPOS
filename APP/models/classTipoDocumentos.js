
let classTipoDocumentos = {
    comboboxTipodoc : async(tipo,idContainer)=>{

        return new Promise((resolve, reject) => {
            let combobox = document.getElementById(idContainer);
        
            let str = ""; 
            axios.get('/tipodocumentos/tipo?empnit=' + GlobalEmpnit + '&tipo=' + tipo + '&app=' + GlobalSistema)
            .then((response) => {
                const data = response.data;        
                data.recordset.map((rows)=>{
                    str += `<option value="${rows.CODDOC}">${rows.CODDOC}</option>`
                })            
                combobox.innerHTML = str;
                resolve();
                //document.getElementById('txtCorrelativo').value = combobox.value;
            }, (error) => {
                
                str = '';
                reject();
            });
               
            }, (error) => {
                console.log(error);
                reject();
            });

       
        
    },
    fcnCorrelativoDocumento: async(tipodoc,coddoc,idContainerCorrelativo)=>{
        
        let correlativo = document.getElementById(idContainerCorrelativo);
    
        axios.get('/tipodocumentos/correlativodoc?empnit=' + GlobalEmpnit + '&tipo=' + tipodoc + '&coddoc=' + coddoc  + '&app=' + GlobalSistema)
        .then((response) => {
            const data = response.data;        
            data.recordset.map((rows)=>{
                correlativo.value = `${rows.CORRELATIVO}`
            })            
        }, (error) => {
            correlativo.value = 0;
            console.log(error);
        });
    },
    getEmpresas: (idContainer)=>{
        return new Promise((resolve, reject) => {
            let combobox = document.getElementById(idContainer);
        
            let str = ""; 
            axios.get('/tipodocumentos/empresas')
            .then((response) => {
                const data = response.data;        
                data.recordset.map((rows)=>{
                    str += `<option value="${rows.EMPNIT}">${rows.EMPNOMBRE}</option>`
                })            
                combobox.innerHTML = str;
                resolve();
            }, (error) => {
                str = '';
                combobox.innerHTML = str;
                reject();
            });
               
            }, (error) => {
                combobox.innerHTML = '';
                console.log(error);
                reject();
            });

    }
}