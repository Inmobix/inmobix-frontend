import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { SidebarComponent } from "../sidebar/sidebar.component"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: "./dashboard.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
