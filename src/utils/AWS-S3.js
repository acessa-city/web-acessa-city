 import ReactS3 from 'react-s3';
 
 //AWS S3
 const config = {
    bucketName: 'acessacity',
    dirName: 'photos',
    region: 'us-east-1',
    accessKeyId: 'AKIA4MS4ONINRO3J3Y3A',
    secretAccessKey: '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',
  }


  const fileUpload = (filePath) =>{

    return new Promise((resolve, reject) => {
      let retorno = {
        sucesso: false,
        mensagem: '',
        fotoUrl: '',
      }
      let allowedFileTypes = ["image/png", "image/jpeg", "image/gif","video/mp4"];

      if (allowedFileTypes.indexOf(filePath.type) > -1) {

        ReactS3.uploadFile(filePath, config)
          .then((data) => {
            console.log(data.location);
        
              retorno.fotoUrl= data.location;
              retorno.sucesso = true;
              retorno.mensagem = 'Arquivo atualizado com sucesso'          

            resolve(retorno);

          })
          .catch((err) => {
            alert(err);
          })
      }else{
        retorno.sucesso = false;
        retorno.mensagem = 'Tipo de arquivo inválido'
        reject(retorno)
      }
    })
  }

  export default fileUpload;