import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})

export class CreatePage implements OnInit {

  codeCatalogoVal = '';
  desCatalogolVal = '';
  // desacronimoVal = '';

  constructor(
    private parmtrservice: CrudService
  ) {
    this.parmtrservice.databaseConn(); 
  }

  ngOnInit() { }

  ionViewDidEnter() {  
    this.parmtrservice.getAllUsers()
  }

  createParametro(){
      this.parmtrservice.addItem(
      this.codeCatalogoVal,
      this.desCatalogolVal,
    );
    this.codeCatalogoVal = '';
    this.desCatalogolVal = '';
    console.log('Informacion agregada');
    
  }

  remove(user) {
    this.parmtrservice.deleteUser(user);
  }
  
}
