// import { useState } from 'react'
import './App.css'
import * as fs from 'fs'

function App() {


  //ERROR WHEN AN INSTANCE ID IS DUPLICATED
  class DuplicateID extends Error{
    public name: string

    constructor(message: string){
      super(message)
      this.name = "DuplicateID"
    }

  }

  //ERROR WHEN AN INSTANCE IS NOT FOUND
  class InstanceNotFound extends Error{
    public name: string

    constructor(message: string){
      super(message)
      this.name = "InstanceNotFound"
    }

  }
  

  //ABSTRACT CLASS TO REPRESENT ALL INSTANCES: PRODUCTS, USERS, ETC
  abstract class Instance{
    constructor(readonly id: number){
    }
  }

  

  // CLASS THAT WILL MANAGE PRODUCTS, USERS, ETC
  class Manager<T extends Instance>{
    private _instances: T[] = []
    constructor(private file: string){}

    //FUNCTION TO ADD AN INSTANCE
    public addInstance(instance: T): void{
      if(this.getInstanceById(instance.id)){
        throw new DuplicateID("No puedes ingresar un id que ya ha sido registrado, vuelve a intentarlo")
      }else{
        this._instances.push(instance)
      }
    }

    //GETTER OF INSTANCES
    public getInstances(): T[] | void{
      this.readFileAndUpdateInstances()
        .then(()=>{
          return this._instances
        })
        .catch((err)=>{
          console.log("error al recuperar los datos: " + err)
        })
      
    }

    public updateInstance(id: number, newInstance: T): void{
      if(id == newInstance.id){
        const index: number = this._instances.findIndex((value: T)=>value.id == id)
        this._instances[index] = newInstance
        this.writeFile()
      }
    }


    //FUNCTION TO GET INSTANCE BY ITS ID
    public getInstanceById(id: number): (T | undefined){
      let instanceFound: T | undefined = this._instances.find((value: T): boolean=>{
        return value.id == id
      })  
      return instanceFound
    }


    //FUNCTION TO WRITE ON THE FILE
    public writeFile(): void{
      fs.promises.writeFile(this.file, JSON.stringify(this._instances), {encoding: 'utf-8'})
        .then((value: any)=>{
          console.log("resultado de la escritura del archivo: " + value)
        })
        .catch((err)=>{
          console.log("Ups hubo un error al querer escribir en el archivo los datos: " + err)
        })
    }


    //ASYNC FUNCTION TO UPDATE THE INSTANCES FROM THE FILE
    public async readFileAndUpdateInstances(): Promise<(T | void)>{
      try{
        this._instances = JSON.parse(await fs.promises.readFile(this.file, {encoding: 'utf-8'})) as T[]
        return Promise.resolve()
      }
      catch(err){
        console.log("Ups hubo un error y no se pudieron actualizar los datos: " + err)
        return Promise.reject()
      }
    }
  } 


  //CLASSES FOR ALL THE INSTANCES

  //PRODUCT
  class Product extends Instance{
    [index: (string)]: (string | number)
    private static idCounter: number = 0
    //using index signatures to access 
    
    constructor(public title: string, public description: string, 
      public price: number, public thumbnail: string, 
      public code: string, public stock: number){
        super(Product.idCounter)
        Product.idCounter++
    } 
  }

  class User extends Instance{
    [index: (string)]: string | number

    private static idCounter: number = 0

    constructor(public username: string, private password: string, 
      public name: string, public lastName:string, public age: number){
        super(User.idCounter)
        User.idCounter++
      }
  }


  try{

  }catch(error){
    
  }finally{

  }
  
  
  

  return (
    <>
      <h1>Market</h1>
    </>
  )
}

export default App
