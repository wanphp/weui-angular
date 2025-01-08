import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from './api.service';
import {UserModel} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  getUser(): Observable<UserModel> {
    return this.get('/user');
  }

  getUsers(data: any): Observable<UserModel[]> {
    return this.get('/users?' + this.getParams(data));
  }

  searchUsers(data: any): Observable<any> {
    return this.get('/user/search?' + this.getParams(data));
  }

  updateUser(user: UserModel): Observable<any> {
    return this.patch('/custom/user', {
      name: user.name,
      tel: user.tel
      //,address: user.address,
      //remark: user.remark
    });
  }
}
