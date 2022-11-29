// >> Consigna:
// Realizar un proyecto de servidor basado en node.js que utilice el módulo express e implemente los siguientes endpoints en el puerto 8080:


// Incluir un archivo de texto 'productos.txt' y utilizar la clase Contenedor del desafío anterior para acceder a los datos persistidos del servidor.

// Antes de iniciar el servidor, colocar en el archivo 'productos.txt' tres productos como en el ejemplo del desafío anterior.

const express = require('express');

const fs = require('fs');

let id = 1;

class Contenedor {
    constructor(name){

        fs.writeFileSync(`./${name}.txt`, JSON.stringify([]));
        this.fileJSON = fs.readFileSync(`./${name}.txt`, 'utf-8')
        this.file = JSON.parse(this.fileJSON)
        this.arr = this.file.length > 0 ? this.file : [];
        this.name = name        

    }
    async save(object){
        // save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        
        let id = 1
        let ids = []
        if(this.arr.length>0){
            this.arr.forEach((o)=>{
                ids.push(o.id)
            });
            id = Math.max(...ids) + 1             
        }
                  
        object.id = id
        this.arr.push(object)
        const arrJSON = JSON.stringify(this.arr)
        try{

            await fs.promises.writeFile(`./${this.name}.txt`, `${arrJSON}`)   
            
        }
        catch (err){
            console.log(err)
        }
        console.log("El id asignado es: "+id)

        
    }
    async getById(id){
        // getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        let object = {}
        
        try{
            await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            .then(value => {
                const arr = JSON.parse(value)
                
                object = arr.find(o=>o.id === id)

                
            })
                       
             
            
            .catch(err=>console.log(err))

        }
        catch (err){
            console.log(err)
        }
        return object



        
                        
    }
    async getAll(){
        // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        let listado = []
        try{
            await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            .then(value=>{
                listado = JSON.parse(value);                
                
            })
            .catch(err=>console.log(err))
        }
        catch (err){
            console.log(err)
        }
        return listado;
       
               
    }
    async deleteById(id){
        // deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try {
            await fs.promises.readFile(`./${this.name}.txt`, 'utf-8')
            .then(value=>{
                const arr = JSON.parse(value)
                const arrFiltrado = this.arr.filter((o)=>o.id !== id)
                const arrJSON = JSON.stringify(arrFiltrado)
                return fs.promises.writeFile(`./${this.name}.txt`, `${arrJSON}`)
            })
        }
        catch (err){
            console.log(err)
        }
       
        
                    
       
    }
    async deleteAll(){
        // deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try{
            await fs.promises.writeFile(`./${this.name}.txt`, `${[]}`)
        }
        catch (err){
            console.log(err)
        }
        
     
    }
}

const productos = new Contenedor('productos')


const producto =  {
    title: 'cuaderno',
    price: 125,
    thumbnail: 'https://www.monoblock.tv/10911-thickbox_default/cuaderno-a4-cuadriculado-macanudo-composition.jpg'
}

const producto1 =  {
    title: 'lapicera',
    price: 60,
    thumbnail: 'https://argentinapilotshop.com.ar/1762-large_default/lapicera-boeing.jpg'
}

const producto2 =  {
    title: 'lapicera2',
    price: 55,
    thumbnail: 'https://argentinapilotshop.com.ar/1762-large_default/lapicera-boeing.jpg'
}

      
productos.save(producto) 
productos.save(producto1) 
productos.save(producto2)




const app = express();

// Ruta get '/productos' que devuelva un array con todos los productos disponibles en el servidor

app.get('/productos', (req, res)=>{
    productos.getAll()
        .then(value => res.send(value))
})
    

    



// Ruta get '/productoRandom' que devuelva un producto elegido al azar entre todos los productos disponibles
app.get('/productoRandom', (req, res)=>{
    
    productos.getAll()
        .then(value => value.length)
        .then(value => (Math.floor(Math.random() * value))+1)
        .then(value => {            
            productos.getById(value)
                .then(value => res.send(value))
        })
   
       

    
})

const PORT = 8080;

app.listen(PORT, ()=> console.log(`Listening in PORT ${PORT}`))