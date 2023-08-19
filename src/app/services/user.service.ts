import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from "@services/api.service";
import {UserEntity} from "@/entities/user.entity";

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  getUser(): Observable<UserEntity> {
    return this.get('/user');
  }

  getUsers(data: any): Observable<UserEntity[]> {
    return this.get('/api/users?' + this.getParams(data));
  }

  searchUsers(data: any): Observable<any> {
    return this.get('/user/search?' + this.getParams(data));
  }

  updateUser(user: UserEntity): Observable<any> {
    return this.patch('/user', {
      name: user.name,
      tel: user.tel
      //,address: user.address,
      //remark: user.remark
    });
  }
}
