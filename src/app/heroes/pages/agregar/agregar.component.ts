import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
      img {
        width: 100%;
        border-radius: 5px;
      }
    `,
  ],
})
export class AgregarComponent implements OnInit {
  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  };
  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('editar')) return;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroe(id)))
      .subscribe((heroe) => (this.heroe = heroe));
  }

  guardar() {
    if (!this.heroe.superhero.trim().length) return;

    if (this.heroe.id) {
      this.heroesService
        .actualizarHeroe(this.heroe)
        .subscribe((resp) => this.mostrarSnakbar('Registro actualizado'));
    } else {
      this.heroesService.agregarHeroe(this.heroe).subscribe((heroe) => {
        this.mostrarSnakbar('Registro insertado');
        this.router.navigate(['/heroes', heroe.id]);
      });
    }
  }

  eliminar() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe,
    });

    dialog.afterClosed().subscribe((resp) => {
      if (resp) {
        this.heroesService.borrarHeroe(this.heroe.id!).subscribe((resp) => {
          this.mostrarSnakbar('Registro eliminado');
          this.router.navigate(['/heroes']);
        });
      }
      console.log(resp);
    });

    /* if (!this.heroe.superhero.trim().length) return;

    if (this.heroe.id) {
      this.heroesService.borrarHeroe(this.heroe.id).subscribe((resp) => {
        this.mostrarSnakbar('Registro eliminado');
        this.router.navigate(['/listado']);
      });
    }*/
  }
  mostrarSnakbar(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 2500,
    });
  }
}
