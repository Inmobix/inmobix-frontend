import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ApiService } from "../../../services/api.service"
import type { UserResponse } from "../../../models/user.model"
import { RouterLink } from "@angular/router"
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./user-list.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserListComponent implements OnInit {
  users: UserResponse[] = []
  loading = true

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res
        this.loading = false
      },
      error: (err) => {
        console.error("Error al listar usuarios", err)
        this.loading = false
      },
    })
  }
}