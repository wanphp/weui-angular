import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserModel} from "../../model/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserModel = {} as UserModel;

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => this.user = user);
  }
}
