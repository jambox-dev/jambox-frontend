import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Song } from '../core/models/song.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, NgFor, TranslatePipe],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() results: Song[] = [];
  @Input() loading = false;

  @Output() add = new EventEmitter<Song>();
  @Output() loadMore = new EventEmitter<void>();

  onAdd(song: Song) {
    this.add.emit(song);
  }
}
