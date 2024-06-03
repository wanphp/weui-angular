import {Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, of} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "@/store/state";
import {catchError} from "rxjs/operators";
import {authConfig} from "@/utils/oauth.config";
import {ToptipsService} from "@components/toptips/toptips.service";
import {ParallelHasher} from "ts-md5";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers = new HttpHeaders();
  private apiUrl = `${authConfig.issuer}/api`;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private topTipsService: ToptipsService
  ) {
    this.store.select('auth').subscribe(({token}) => {
      this.headers = this.headers.set('Authorization', 'Bearer ' + token);
    });
  }

  setApiUrl(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  protected getParams(data: Map<string, string | number>): string {
    let params = new HttpParams();
    for (let [key, value] of data) {
      params = params.set(key, value);
    }
    return params.toString();
  }

  post(path: string, body: any, json: boolean = true): Observable<any> {
    let headers = this.headers;
    if (json) headers = this.headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.apiUrl + path, body, {headers: headers}).pipe(catchError(error => this.handleError(error)));
  }

  put(path: string, body: any, json: boolean = true): Observable<any> {
    let headers = this.headers;
    if (json) headers = this.headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.apiUrl + path, body, {headers: headers}).pipe(catchError(error => this.handleError(error)));
  }

  patch(path: string, body: any, json: boolean = true): Observable<any> {
    let headers = this.headers;
    if (json) headers = this.headers.set('Content-Type', 'application/json');
    return this.http.patch<any>(this.apiUrl + path, body, {headers: headers}).pipe(catchError(error => this.handleError(error)));
  }

  get(path: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + path, {headers: this.headers}).pipe(catchError(error => this.handleError(error)));
  }

  delete(path: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + path, {headers: this.headers}).pipe(catchError(error => this.handleError(error)));
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

  private hasher: any;

  public parallelHash() {
    if (this.hasher) return this.hasher;
    this.hasher = new ParallelHasher('./assets/js/md5_worker.js');
    return this.hasher;
  }
}
