import {Component, OnInit} from '@angular/core';
import {UserService} from "@services/user.service";
import {UserEntity} from "@/entities/user.entity";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserEntity = {} as UserEntity;

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => this.user = user);
  }
}
