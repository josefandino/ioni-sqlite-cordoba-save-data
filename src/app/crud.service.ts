import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class CrudService {
  
  private dbInstance: SQLiteObject;
  readonly dbName: string = 'dbparametros.db';
  readonly dbTable: string = 'userTable';
  PARMTRS: Array <any> ;

  constructor(
    private platform: Platform,
    private sqlite: SQLite    
  ) { 
    this.databaseConn();
  }

  // Create SQLite database 
  databaseConn() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: this.dbName,
        location: 'default'
      }).then((sqLite: SQLiteObject) => {
        this.dbInstance = sqLite;
        sqLite.executeSql(`
                CREATE TABLE IF NOT EXISTS ${this.dbTable} (
                  user_id INTEGER PRIMARY KEY, 
                  name varchar(255),
                  email varchar(255),
                )`, [])
          .then((res) => {
            // alert(JSON.stringify(res));
            console.log(res);
            
          })
          .catch((e) => alert(JSON.stringify(e)));
      })
        .catch((e) => alert(JSON.stringify(e)));
    });
  }

    // Crud
    public addItem(a, b) {
      // validation
      if (!a.length || !b.length ) { 
        alert('Los campos deben ser llenados...');
        return;
      }
      this.dbInstance.executeSql(`
        INSERT INTO ${this.dbTable} 
        (name, email)
        VALUES ('${a}', '${b}' )`, [])
        .then(() => {
          alert('Felicitaciones!!! información agregada satisfactoriamente....');
          this.getAllUsers();
        }, (e) => alert(JSON.stringify('Error al agregar información..', e.err)));
    }

    getAllUsers() {
      return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable}`, [])
        .then((res) => {
          this.PARMTRS = [];
          if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
              this.PARMTRS.push(res.rows.item(i));
            }
            return this.PARMTRS;
          }
        }, (e) => alert(JSON.stringify(e)));
    }

    // Get data
    getUser(id): Promise<any> {
      return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE user_id = ?`, [id])
      .then((res) => { 
        return {
          user_id: res.rows.item(0).user_id,
          name: res.rows.item(0).name,  
          email: res.rows.item(0).email,
        }
      });
    }

    // Update
    updateUser(id, name, email) {
      const data = [name, email];
      return this.dbInstance.executeSql(`UPDATE ${this.dbTable} SET name = ?, email = ? WHERE user_id = ${id}`, data)
    }  

    // Delete
    deleteUser(user) {
      this.dbInstance.executeSql(`
      DELETE FROM ${this.dbTable} WHERE user_id = ${user}`, [])
        .then(() => {
          alert('Datos eliminados del sistema...');
          this.getAllUsers();
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
    }

}
