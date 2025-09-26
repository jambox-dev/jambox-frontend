import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Song } from '../core/models/song.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() results: Song[] = [];

  @Output() add = new EventEmitter<Song>();

  onAdd(song: Song) {
    this.add.emit(song);
  }
}
