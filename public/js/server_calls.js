function GetDataFromServer(url,itemName,Callback){
    fetch(url, {
            method: 'GET'
            }).then(response => {
                if(response.ok){
                response.json().then((result)=>{
                    if(result.code == 1){
                        Callback(result.data)
                        }else{swal(`Could Not Get ${itemName} from server`) }
                })                                                   
                }else{
                
                    swal(`Could Not Get ${itemName}.Network?`)                                                                                                                        
                }
            })
}