# Soft_Imperio

### Flujo de despliegue

![Flow](./Documentation/deploy-flow.png "Despliegue")

[Archivo excalidraw editable](./Documentation/deploy-flow.excalidraw)

### Diagrama de Arquitectura

![Flow](./Documentation/Diagrama%20Arquitectura%20.png "Flow")

[Archivo excalidraw editable](./Documentation/Diagrama%20Arquitectura%20.excalidraw)

### Api GateWay

![Flow](./Documentation/api-gateway.png "Flow")

[Archivo excalidraw editable](./Documentation/deploy-flow.excalidraw)

## Diagramas de secuencias

### Autenticación

![Autenticacion](./Documentation/Diagrama_de_secuencia_autenticación.png "Autenticación")

### Punto de venta en Mesa

![p.v.mesa](./Documentation/Diagrama_de_secuencia_p.v.mesa.png "p.v.mesa")

### Punto de venta en Barra

![p.v.Barra](./Documentation/Diagrama_de_secuencia_p.v.Barra.png "p.v.Barra")

## Despliegue

### Crear una instancia EC2 ubuntu

Seguir los pasos del siguiente sitio para crear la instancia EC2:

[Crear instancia EC2](https://dev.to/jeptoo/how-to-create-ec2-instance-ubuntu-2204-on-aws-and-connect-via-ssh-using-pem-492o)

### Conectarse a la instancia

1. buscamos EC2
![buscar Ec2](./Documentation/ec2/ec2-search.png "buscar Ec2")

2. Seleccionamos EC2
![seleccionar Ec2](./Documentation/ec2/ec2-select.png "seleccionar Ec2")

3. Nos conectamos a la instancia por el navegador (esto nos abre una ventana nueva)
![conexión ssh Ec2](./Documentation/ec2/ec2-connect.png "seleccionar Ec2")

![conexión ssh Ec2](./Documentation/ec2/ec2-conexion-ssh.png "seleccionar Ec2")


### Configuración Nginx en instancia EC2 ubuntu

1. Una vez dentro de la instancia EC2 lanzamos los siguientes comandos:

1.1. Para actualizar o parchar la linea base del sistema operativo ubuntu

```sudo apt update && sudo apt upgrade```

Si en ocaciones la pantalla se pone así, nos movemos con la tecla ```tabulador``` hasta ```ok``` y precionamos ```enter```

![imagen Ec2](./Documentation/ec2/ec2-parchado.png "seleccionar Ec2") 

1.2. Instalamos el servidor Nginx

```sudo apt install nginx```

1.3. Validamos la instalación de Nginx, abriendo en el navegador la url publica que nos proporciona la instancia EC2. Al seguir los pasos de la imagen en el navegador cambiamos ```https``` por ```http``` y agregamos un ```/``` al final. 
Ejemplo ```http://ec2-18-212-187-130.compute-1.amazonaws.com/```



![imagen Ec2](./Documentation/ec2/ec2-connect-browser.png "seleccionar Ec2") 

El resultado será este al abrir la url en el navegador:

![imagen Ec2](./Documentation/ec2/ec2-show-nginx.png "seleccionar Ec2") 

1.4. Regresamos a la pestaña del navegador donde estamos conectados a la instancia EC2 para eliminar el ```html``` que visualizamos en la imagen anterior.

* Dentro de la instancia ejecutamos:

```cd /var/www/html/```

```ls``` con esto vemos el archivo ```.html``` el cual vamos a eliminar

```sudo rm nombreArchivo.html``` cambiar ```nombreArchivo``` por el nombre del archivo que visualizamos arriba

```ls``` para asegurarnos que ya no aparezca el archivo

1.5. Subimos a la instancia EC2 todos los archivos front web del proyecto

Estos archivos ```html``` ```css``` ```js``` deben quedar en la ruta ```/var/www/html/```

* Otorgamos permisos a otros usuarios para ```/var/www/html/``` para poder crear o eliminar archivos, ejecutando:

```sudo chown -R $USER:$USER /var/www/html/```

```sudo chmod -R 755 /var/www/html/```

### Subir los archivos front web a la instancia EC2 ubuntu

* Para subir los archivos a la instancia EC2 nos ayudamos de ```Github Actions```, usando ```Rsync Deployments Action```

- Creamos un archivo en nuestro repositorio de github en la ruta ```.github/workflows/upload-front.yaml``` [upload-front.yaml](https://github.com/TatianaHoyos/SoftImperio/blob/main/.github/workflows/upload-front.yaml)

- El archivo contendrá la tarea:

```yaml
- name: 📂 rsync Upload front
    uses: burnett01/rsync-deployments@5.1
    with:
      switches: -avzr --delete
      path: Frontend/WEB/*
      remote_path: /var/www/html/
      remote_host: <host de instancia EC2>
      remote_user: ubuntu
      remote_key: "${{ secrets.SSH_PRIVATE_KEY_EC2 }}"
```

Allí hay que reemplazar el valor ```<host de instancia EC2>``` por el host que nos proporciona la instancia EC2 (este host cambia cada vez que se apaga e inicia la instancia).

La propiedad ```path: Frontend/WEB/*``` será la ruta donde están alojados los archivios front web en nuestro repositorio que queremos subir a la instancia EC2

La variable ```SSH_PRIVATE_KEY_EC2``` se debe crear en la sección de secrets de github (el contenido del archivo .pem [la llave] que se descargó al momento de crear la instancia EC2), de esta forma:

![imagen secret github](./Documentation/ec2/github-action-scret.png "seleccionar Ec2") 

![imagen secret github](./Documentation/ec2/github-action-scret-2.png "seleccionar Ec2") 
 
- Una vez creado el archivo ```.github/workflows/upload-front.yaml``` e integrado al branch ```main``` encontraremos la ejecución del github action acá

![imagen secret github](./Documentation/ec2/github-action-execute.png "seleccionar Ec2") 

Si la ejecución fue exitosa, nuestros archivos front web estarán en la instancia EC2

![imagen secret github](./Documentation/ec2/github-action-execute-2.png "seleccionar Ec2") 

- En la instancia EC2 verificamos si están los archivos.

```cd /var/www/html/```

```ls```

![imagen secret github](./Documentation/ec2/ec2-upload-files.png "seleccionar Ec2") 

- Ahora en el navegador podemos acceder a nuestro ```.html``` principal, sólo hacemos el paso ```1.3.``` y agregamos en la url el nombre del archivo ejemplo ```http://ec2-18-212-187-130.compute-1.amazonaws.com/iniciosesion.html```

1.6. Configurar nginx

- Si nuestro sitio no tiene un ```index.html``` podemos cofiguarar que cuando ingresemos al dns de la instancia EC2 abra un archivo ```.html``` por defecto:

- Editamos el archivo ```/etc/nginx/sites-available/default```

```sudo nano /etc/nginx/sites-available/default```  acá podemos editar el archivo desde la terminal

Podemos usar las teclas de ```flecha hacia arriba, abajo, derecha e izquierda ``` para desplazarnos en el archivo, para confirguar algun cambio precionamos la combinación de teclas ```ctrl + o``` luego ```Enter``` y por último ```ctrl + x```

identificamos la linea: 
![imagen secret github](./Documentation/ec2/nginx-init-file.png "seleccionar Ec2") 

y podemos nuestro archivo principal así ```index index.html index.htm iniciosesion.html;``` de esta forma si no encuentra un ```index.html``` buscará ```iniciosesion.html```

- Configurar los ```cors``` (seguimos editando el archivo ```/etc/nginx/sites-available/default```)

identificamos la linea: 
![imagen secret github](./Documentation/ec2/nginx-init-file-.png "seleccionar Ec2") 

y pegamos lo siguiente:

```
location / {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
        try_files $uri $uri/ =404;
}
```

Guardamos la configuración precionamos la combinación de teclas ```ctrl + o``` luego ```Enter``` y por último ```ctrl + x```

Ahora podemos disfrutar de nuestro sitio web alojado en una instancia EC2

### Configuración Docker en instancia EC2 ubuntu

1. Nos conectamos a la instancia EC2 como lo hicimos anteriormente

2. Instalamos docker ejecutando los siguientes comandos:

```sudo apt-get install docker.io -y```

```sudo systemctl start docker```

```systemctl enable docker```

```docker --version```

```sudo usermod -a -G docker $(whoami)```

3. Creamos una red dentro de docker para la comunicación entre los contenedores:

```docker network ls```

```docker network create --attachable imperionet```

```docker network ls```

4. Verificamos que exista el archivo ```/etc/docker/daemon.json``` y tenga contenido:

```cat /etc/docker/daemon.json```

Editamos el archivo o lo creammos:

```sudo nano /etc/docker/deamon.json```

el archivo debe tener este contenido:

```json
{
 "dns": ["172.17.0.1", "8.8.8.8", "1.1.1.1"]
}
```

Reiniciamos docker:

```sudo systemctl restart docker```


Estos comandos se ejecutan una sola vez, sólo en la instalación y configuración de docker

### Compilar las APIs, Crear imagen docker y publicar las imagenes en Amazon Elastic Container Registry

* Para compilar, crear la imegen docker y subir las imagenes a Amazon Elastic Container Registry nos ayudamos de ```Github Actions```

- Creamos los archivos en nuestro repositorio de github en la ruta:
  
   ```.github/workflows/api-gateway-java.yaml``` para el API Gateway (Java) [api-gateway-java.yaml](https://github.com/TatianaHoyos/SoftImperio/blob/main/.github/workflows/api-gateway-java.yaml)

   ```.github/workflows/api-java.yaml``` para el API Seguridad (Java) [api-java.yaml](https://github.com/TatianaHoyos/SoftImperio/blob/main/.github/workflows/api-java.yaml)

   ```.github/workflows/api-venta-CSharp.yml``` para el API Venta (C#) [api-venta-CSharp.yml](https://github.com/TatianaHoyos/SoftImperio/blob/main/.github/workflows/api-venta-CSharp.yml)
   

- Los archivos contendrán tareas de compilación, creación de imagen docker y publicación de la imagen docker

- Al ejecutar los Workflows y su ejecución es exitosa se visualizaran así:

![github-action-apis-docker](./Documentation/ec2/github-action-apis-docker.png "github-action-apis-docker") 

- De esa forma podremos visualizar las imagenes docker en Amazon Elastic Container Registry

![ecr](./Documentation/ec2/ecr.png "ecr") 

![ecr-images](./Documentation/ec2/ecr-images.png "ecr-images") 

### Ejecutar las APIs por medio de las imagenes docker en la instancia EC2

1. Hacer pull de las imagenes docker:

Copiamos la url de las imagenes docker en el registry para descargarlas:

![ecr-images-url](./Documentation/ec2/ecr-images-url.png "ecr-images-url") 

2. Nos conectamos a la instancia EC2


3. Ejecutamos los siguientes comandos

```sudo systemctl status docker``` Verificamos que docker esté corriendo

```docker pull url-image``` Reemplazamos la ```url-image``` por la url que copiamos anteriormente

```docker pull public.ecr.aws/u8j8i3w5/imperio-public-registry:latest``` API Venta (C#)

```docker pull public.ecr.aws/u8j8i3w5/imperio-public-registry:api-java-latest``` API Seguridad (Java)

```docker pull public.ecr.aws/u8j8i3w5/imperio-public-registry:api-gateway-latest``` para el API Gateway (Java)

1. Listamos las imagenes:

```docker images```

5. Corremos las imagenes docker

Copiamos el ```ID``` de las imagenes que listamos en el paso anterior

Ejecutamos los comandos reemplazando ID-IMAGE por el ID que copiamos:

```docker run -d -p 7084:80 --name pruebaNet ID-IMAGE```
```docker run -d -p 8080:8080 --name pruebaJava ID-IMAGE```
```docker run -e HOST_API_VENTA='http://pruebaNet' -e HOST_API_JAVA='http://pruebaJava:8080' -d -p 8081:8081 --name apigateway ID-IMAGE```

```docker ps``` Verificamos que los contenedores esten corriendo (deben visualizarse 3)

```docker ps -a``` Para ver si hay algun contenedor en stop


5. Añadimos los contenedores a la red que creamos anteriormente:

```docker network connect imperionet pruebaNet```

```docker network connect imperionet pruebaJava```

```docker network connect imperionet apigateway```

```docker network inspect imperionet``` Verificamos que los 3 contenedores estén dentro de la red


#### Comandos de ayuda:

```docker ps -a``` Ver todos los contenedores

```docker stop pruebaJava``` Detener un contenedor en este caso ```pruebaJava```

```docker start pruebaJava``` Iniciar un contenedor en este caso ```pruebaJava```

```docker logs apigateway -f``` ver los logs en tiempo real de un contenedor en este caso ```apigateway```

```docker rm pruebaJava``` eliminar un contenedor en este caso ```pruebaJava```

```docker images``` listar las imagenes docker

```docker rmi 35353aa23e91``` eliminar una imagen docker reemplazar ```35353aa23e91``` por el id correspondiente, vissualizado con el comando anterior

### Configuración de Nginx para comunicar los contenedores

Debemos crear un proxy en el servidor Nginx para redireccionar las solicitudes rest a los contenedores


1. Editar el archivo:

```sudo nano /etc/nginx/sites-available/default```

debemos añadir al archivo lo siguiente:

```
location /edge-service {
              #proxy_pass http://localhost:8081;
              # Redirigir todas las solicitudes a http://localhost:8081
                # Proxy_pass para enviar las solicitudes al servidor local
                proxy_pass http://localhost:8081;

                # Configuración de encabezados CORS
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
                add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';

                # Permitir solicitudes OPTIONS sin procesamiento adicional
                if ($request_method = 'OPTIONS') {
                        add_header 'Access-Control-Allow-Origin' '*';
                        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
                        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
                        add_header 'Access-Control-Max-Age' 1728000;
                        add_header 'Content-Type' 'text/plain charset=UTF-8';
                        add_header 'Content-Length' 0;
                        return 204;
                }
        }
```

De esta forma todas las solicitudes al servidor Nginx que contengan ```/edge-service``` en la URL se redireccionará a ```http://localhost:8081``` que es el endpoint que expone el contenedor del apigateway

. Reiniciar Nginx 

```sudo service nginx restart```