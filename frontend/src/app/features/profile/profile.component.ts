import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    nom: '',
    email: '',
    ville: '',
    role: '',
    profilPhoto: '',
    motDePasse: '',
  };

  username = '';
  activeTab: string = 'places';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;
      console.log('User data:', data);

      // fallback si nom vide
      this.username = '@' + this.user.nom
        ? this.user.nom.toLowerCase().replace(/\s/g, '')
        : 'unknown';

      // fallback si ville vide
      if (!this.user.ville) {
        this.user.ville = 'Unknown';
      }
    });
  }
}
