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
      <input type="password" #pw>
      <button (click) = "newUser(email.value, pw.value)">neuer User</button>
    </div>

    <div>
      <input #email1>
      <input type="password" #pw1>
      <button (click) = "checkUser(email1.value, pw1.value)">check User</button>
    </div>
  `
})

export class AppComponent {
  title = 'Frontend';

  constructor(
    private credentialsService:CredentialsService,
    private http:HttpClient
  ){}


  //beim Build nur den relativen Pfad angeben
  login(){
    //this.http.post('https://localhost/login', {
    this.http.post('/login', {
      email: "test1@test.de",
      pw: "test"
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
    //this.http.post('https://localhost/token', {
    this.http.post('/token', {
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

  newUser(email, pw) {
    //this.http.post('http://localhost:3000/newUser', {
    this.http.post('/newUser', {
      email,
      pw
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

  checkUser(email, pw) {
    //this.http.post('http://localhost:3000/checkUser', {
    this.http.post('/checkUser', {
      email,
      pw
    })
    .subscribe(
      (x:any) => {
        console.log(x)
      },
      e => console.log(e)
    )
  }

}


