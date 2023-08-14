import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "@/store/state";
import {catchError} from "rxjs/operators";
import {authConfig} from "@/utils/oauth.config";
import {ToptipsService} from "@components/toptips/toptips.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private topTipsService: ToptipsService
  ) {
    this.store.select('auth').subscribe(({token}) => {
      this.httpOptions.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    });
  }

  protected getParams(data: Map<string, string | number>): string {
    let params = new HttpParams();
    for (let [key, value] of data) {
      params = params.set(key, value);
    }
    return params.toString();
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post<any>(`${authConfig.issuer}/api${url}`, body, this.httpOptions).pipe(catchError(error => this.handleError(error)));
  }

  put(url: string, body: any): Observable<any> {
    return this.http.put<any>(`${authConfig.issuer}/api${url}`, body, this.httpOptions).pipe(catchError(error => this.handleError(error)));
  }

  patch(url: string, body: any): Observable<any> {
    return this.http.patch<any>(`${authConfig.issuer}/api${url}`, body, this.httpOptions).pipe(catchError(error => this.handleError(error)));
  }

  get(url: string): Observable<any> {
    return this.http.get<any>(`${authConfig.issuer}/api${url}`, this.httpOptions).pipe(catchError(error => this.handleError(error)));
  }

  delete(url: string): Observable<any> {
    return this.http.delete<any>(`${authConfig.issuer}/api${url}`, this.httpOptions).pipe(catchError(error => this.handleError(error)));
  }

  private handleError(response: HttpErrorResponse): Observable<any> {
    console.log(response, response.status);
    if (response.status == 401) {
      localStorage.removeItem('access_token');
      location.reload();
    }
    if (response.status == 400) this.topTipsService.warn(response.error.errMsg);
    return of(undefined);
  }

}
