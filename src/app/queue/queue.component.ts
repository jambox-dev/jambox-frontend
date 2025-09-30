import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { QueueService } from '../core/services/queue.service';
import { Song } from '../core/models/song.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent implements OnInit {
  private queueService = inject(QueueService);
  public queue$!: Observable<Song[]>;

  ngOnInit(): void {
    this.queue$ = this.queueService.getQueue();
  }
}
