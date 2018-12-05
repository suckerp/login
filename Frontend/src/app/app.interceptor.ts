import { Injectable } from '@angular/core'
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor
} from '@angular/common/http'

import { CredentialsService } from './app.service'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private credentialsService:CredentialsService
    ){}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(
            request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + this.credentialsService.token,
                    token: this.credentialsService.token
                }
            })
        )
    }
}