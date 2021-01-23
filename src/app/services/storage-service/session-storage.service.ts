import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  storage: Storage = localStorage;
  constructor() { }

  addDataToStorage(key: string,value: string){
    this.storage.setItem(key,value);
  }

  getDataFromStorage(key:string): string{
    return this.storage.getItem(key);
  }

  checkKeyExistedOrNot(key:string): boolean{
    if(this.storage.getItem(key)!=null){
      return true;
    }else{
      return false;
    }
  }
  deleteKeyFromStore(key:string){
    this.storage.removeItem(key);
  }

  clearStore(){
    this.storage.clear();
  }
}
