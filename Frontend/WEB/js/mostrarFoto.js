function showPreview(event){
    
    if (event.target.files.length > 0) {
      const fileSize = event.target.files[0].size; // Tamaño en bytes
      const maxSizeInBytes = 3 * 1024 * 1024; // 3 MB (ajusta este valor según tus necesidades)
      
      if (fileSize > maxSizeInBytes) {
          alert('El tamaño de la imagen es demasiado grande. El tamaño máximo permitido es de 3 MB.');
          event.preventDefault(); // Evita que se envíe el formulario
      }else{
        if(event.target.files.length > 0){
          var src = URL.createObjectURL(event.target.files[0]);
          var preview = document.getElementById("foto-preview");
          preview.src = src;
          preview.style.display = "block";
        }
      }
    }
}

