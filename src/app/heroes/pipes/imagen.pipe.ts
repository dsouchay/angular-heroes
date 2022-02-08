import { Pipe, PipeTransform } from '@angular/core';
import { Heroe } from '../interfaces/heroes.interface';

@Pipe({
  name: 'imagen',
  //pure: false,-> para que se cargue siempre  no cdo se refresque
})
export class ImagenPipe implements PipeTransform {
  transform(heroe: Heroe): string {
    // return 'assets/heroes/' + heroe.id + '.jpg';

    const path = `assets/heroes/${heroe.id}.jpg`;
    let fileExist = true;

    if (!heroe.id && !heroe.alt_img) return 'assets/no-image.png';
    else if (heroe.alt_img) return heroe.alt_img;

    return path;
  }
}
