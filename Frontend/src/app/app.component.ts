import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CredentialsService } from './app.service'

@Component({
  selector: 'app-root',
  template: `
    <button (click) = "login()">send</button>
    <button (click) = "token()">check</button>
    <div>
      <input #email>
      <input type="password" #password>
      <button (click) = "newUser(email.value, password.value)">neuer User</button>
    </div>

    <div>
      <input #email1>
      <input type="password" #password1>
      <button (click) = "checkUser(email1.value, password1.value)">check User</button>
    </div>
  `
})

export class AppComponent {
  title = 'Frontend';

  constructor(
    private credentialsService:CredentialsService,
    private http:HttpClient
  ){}

  login(){
    this.http.post('https://localhost/login', {
      email: "test1@test.de",
      password: "test"
    })
    .subscribe(
      (x:any) => {
        this.credentialsService.token = x.token
      },
      e => {
        console.log(e)
      }
    )
  }

  token(){
    this.http.post('https://localhost/token', {
    })
    .subscribe(
      (x:any) => {
        console.log(x)
      },
      e => {
        console.log(e)
      }
    )
  }

  newUser(email, password) {
    this.http.post('https://localhost:3000/newUser', {
      email,
      password
    })
    .subscribe(
      (x:any) => {
        if (x.auth) {
          this.credentialsService.token = x.token
          console.log(x.token)
        }
      },
      e => console.log(e)
    )
  }

  checkUser(email, password) {
    this.http.post('https://localhost:3000/checkUser', {
      email,
      password
    })
    .subscribe(
      (x:any) => {
        console.log(x)
      },
      e => console.log(e)
    )
  }

}


